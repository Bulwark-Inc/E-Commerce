from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet
from payments.views import InitializePaymentView  # Import InitializePaymentView here

# Router setup for order-related endpoints
router = DefaultRouter()
router.register('', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),  # List and manage orders
    path('<int:order_id>/initialize_payment/', InitializePaymentView.as_view(), name='initialize-payment'),  # Initialize payment for a specific order
]
