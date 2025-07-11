from rest_framework import status, permissions, generics
from rest_framework.response import Response
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json

from orders.models import Order
from payments.models import Payment
from payments.serializers import PaymentSerializer
from payments.services.payment_service import (
    initialize_transaction,
    verify_transaction,
    handle_webhook_event,
    check_signature,
    PaymentGatewayError,
    PaymentNotFound,
)
from permissions.utils import user_has_permission


class InitializePaymentView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        order_id = kwargs.get("order_id")
        order = get_object_or_404(Order, id=order_id)

        if order.user != request.user and not user_has_permission(request.user, 'manage_orders'):
            return Response({"error": "Unauthorized"}, status=403)

        if order.status != 'pending':
            return Response({"error": f"Cannot pay for order: {order.get_status_display()}"}, status=400)

        payment = get_object_or_404(Payment, order=order)

        callback_url = f"{settings.FRONTEND_URL}/order-confirmation/{order.id}/?reference={payment.reference}"

        try:
            result = initialize_transaction(payment, request.user.email, callback_url)
            if result.get("status"):
                return Response({
                    "payment_url": result["data"]["authorization_url"],
                    "reference": payment.reference
                })
            return Response(result, status=400)
        except PaymentGatewayError as e:
            return Response({"error": str(e)}, status=503)


@method_decorator(csrf_exempt, name='dispatch')
class PaymentWebhookView(generics.CreateAPIView):
    permission_classes = []  # public endpoint from payment gateway

    def create(self, request, *args, **kwargs):
        signature = request.META.get('HTTP_X_PAYSTACK_SIGNATURE')
        raw_body = request.body

        if not check_signature(raw_body, signature):
            return Response({"error": "Invalid signature"}, status=403)

        try:
            payload = json.loads(raw_body)
            event = payload.get('event')
            data = payload.get('data', {})
            handle_webhook_event(event, data)
            return Response({"status": "Processed"})
        except PaymentNotFound:
            return Response({"error": "Payment not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class VerifyPaymentView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        reference = request.query_params.get("reference")
        if not reference:
            return Response({"error": "Reference required"}, status=400)

        payment = Payment.objects.filter(reference=reference).first()
        if not payment:
            return Response({"error": "Payment not found"}, status=404)

        if payment.order.user != request.user and not user_has_permission(request.user, 'manage_orders'):
            return Response({"error": "Unauthorized"}, status=403)

        try:
            result = verify_transaction(reference)
            if result.get("status") and result["data"]["status"] == "success":
                handle_webhook_event('charge.success', result['data'])  # simulate webhook logic
                return Response({"status": "Payment verified", "order_id": payment.order.id})
            return Response({"status": "Payment not successful"}, status=400)
        except PaymentGatewayError as e:
            return Response({"error": str(e)}, status=503)
