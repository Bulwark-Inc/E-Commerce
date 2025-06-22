from django.urls import path
from .views import PaymentWebhookView, VerifyPaymentView

urlpatterns = [
    path('webhook/', PaymentWebhookView.as_view(), name='payment-webhook'),
    path('verify/', VerifyPaymentView.as_view(), name='verify-payment'),
]
