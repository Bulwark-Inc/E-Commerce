import requests
import hmac
import hashlib
from django.conf import settings
from django.db import transaction
from orders.models import Order
from payments.models import Payment
from requests.exceptions import Timeout, HTTPError


class PaymentGatewayError(Exception): pass
class PaymentNotFound(Exception): pass
class UnauthorizedPaymentAccess(Exception): pass


def get_headers():
    return {
        "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json"
    }


def initialize_transaction(payment, user_email, callback_url):
    url = "https://api.paystack.co/transaction/initialize"
    payload = {
        "email": user_email,
        "amount": int(payment.amount * 100),
        "reference": payment.reference,
        "callback_url": callback_url
    }
    try:
        res = requests.post(url, json=payload, headers=get_headers())
        res.raise_for_status()  # This will raise an HTTPError for 4xx or 5xx responses
        return res.json()
    except Timeout as e:
        raise PaymentGatewayError(f"Request timed out: {str(e)}")
    except HTTPError as e:
        raise PaymentGatewayError(f"HTTP error occurred: {str(e)}")
    except requests.RequestException as e:
        raise PaymentGatewayError(f"General error: {str(e)}")


def verify_transaction(reference):
    url = f"https://api.paystack.co/transaction/verify/{reference}"
    try:
        res = requests.get(url, headers=get_headers())
        res.raise_for_status()
        return res.json()
    except requests.RequestException as e:
        raise PaymentGatewayError(str(e))


@transaction.atomic
def handle_webhook_event(event, data):
    reference = data.get("reference")
    payment = Payment.objects.filter(reference=reference).first()
    if not payment:
        raise PaymentNotFound("Payment reference not found")
    
    if payment.status == 'completed':
        return  # Prevent re-processing

    order = payment.order

    if event == 'charge.success':
        payment.status = 'completed'
        payment.transaction_id = str(data.get('id', ''))
        payment.save()
        
        if order.status == 'pending':
            order.status = 'processing'
            order.save()

    elif event == 'charge.failed':
        payment.status = 'failed'
        payment.save()


def check_signature(raw_body, signature):
    expected = hmac.new(
        settings.PAYSTACK_SECRET_KEY.encode(),
        raw_body,
        hashlib.sha512
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
