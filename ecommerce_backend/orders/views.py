from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import requests

from .models import Order, Payment
from .serializers import OrderSerializer, OrderCancelSerializer, PaymentSerializer


def is_order_accessible(order, user):
    """Check if the order belongs to user or if user is staff."""
    return order.user == user or user.is_staff


def paystack_headers():
    return {
        "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json"
    }


def initialize_paystack_transaction(payload):
    url = "https://api.paystack.co/transaction/initialize"
    try:
        response = requests.post(url, headers=paystack_headers(), json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Paystack init error: {str(e)}")


def verify_paystack_transaction(reference):
    url = f"https://api.paystack.co/transaction/verify/{reference}"
    try:
        response = requests.get(url, headers=paystack_headers())
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Paystack verify error: {str(e)}")


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    @action(detail=True, methods=['post'], serializer_class=OrderCancelSerializer)
    def cancel(self, request, pk=None):
        order = self.get_object()
        serializer = self.get_serializer(order, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"status": "Order cancelled successfully"})

    @action(detail=True, methods=['post'])
    def initialize_payment(self, request, pk=None):
        order = self.get_object()

        if not is_order_accessible(order, request.user):
            return Response(
                {"error": "You do not have permission to process this payment"},
                status=status.HTTP_403_FORBIDDEN
            )

        if order.status != 'pending':
            return Response(
                {"error": f"Cannot process payment for order with status: {order.get_status_display()}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment = get_object_or_404(Payment, order=order)
        payload = {
            "email": request.user.email,
            "amount": int(payment.amount * 100),
            "reference": payment.reference,
            "callback_url": f"{settings.FRONTEND_URL}/order-confirmation/{order.id}/?reference={payment.reference}"
        }

        try:
            response_data = initialize_paystack_transaction(payload)
            if response_data.get('status'):
                return Response({
                    "payment_url": response_data['data']['authorization_url'],
                    "reference": payment.reference
                })
            else:
                return Response(
                    {"error": "Payment initialization failed", "details": response_data},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except RuntimeError as e:
            return Response({"error": str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


@method_decorator(csrf_exempt, name='dispatch')
class PaymentWebhookView(generics.CreateAPIView):
    permission_classes = []

    def create(self, request, *args, **kwargs):
        payload = request.data
        event = payload.get('event')
        data = payload.get('data', {})
        reference = data.get('reference')

        if not event or not reference:
            return Response({"error": "Invalid webhook payload"}, status=status.HTTP_400_BAD_REQUEST)

        payment = Payment.objects.filter(reference=reference).first()
        if not payment:
            return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)

        order = payment.order

        try:
            with transaction.atomic():
                if event == 'charge.success':
                    payment.status = 'completed'
                    payment.transaction_id = data.get('id', '')
                    payment.save()

                    order.status = 'processing'
                    order.save()

                elif event == 'charge.failed':
                    payment.status = 'failed'
                    payment.save()

            return Response({"status": "webhook processed"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyPaymentView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        reference = request.query_params.get('reference')
        if not reference:
            return Response({"error": "Reference is required"}, status=status.HTTP_400_BAD_REQUEST)

        payment = Payment.objects.filter(reference=reference).first()
        if not payment:
            return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)

        if not is_order_accessible(payment.order, request.user):
            return Response(
                {"error": "You do not have permission to verify this payment"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            response_data = verify_paystack_transaction(reference)
            if response_data.get('status'):
                data = response_data.get('data', {})

                with transaction.atomic():
                    if data.get('status') == 'success':
                        payment.status = 'completed'
                        payment.transaction_id = data.get('id', '')
                        payment.save()

                        order = payment.order
                        order.status = 'processing'
                        order.save()

                        return Response({
                            "status": "Payment verified successfully",
                            "order_id": order.id
                        })

                    else:
                        return Response({
                            "status": "Payment not successful",
                            "gateway_response": data.get('gateway_response')
                        }, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                "error": "Payment verification failed",
                "details": response_data
            }, status=status.HTTP_400_BAD_REQUEST)

        except RuntimeError as e:
            return Response({"error": str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
