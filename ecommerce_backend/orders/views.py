from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Order
from .serializers import (
    OrderSerializer,
    OrderCheckoutSerializer,
    OrderCancelSerializer,
)
from permissions.utils import user_has_permission


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user_has_permission(user, 'manage_orders'):
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    def perform_create(self, serializer):
        # Prevent creating via default .create() - use checkout instead
        raise NotImplementedError("Use the 'checkout' action to create orders.")

    @action(detail=False, methods=['post'], serializer_class=OrderCheckoutSerializer)
    def checkout(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], serializer_class=OrderCancelSerializer)
    def cancel(self, request, pk=None):
        order = self.get_object()

        # Only allow the owner or a manager to cancel
        if order.user != request.user and not user_has_permission(request.user, 'manage_orders'):
            return Response({"detail": "You do not have permission to cancel this order."},
                            status=status.HTTP_403_FORBIDDEN)

        if not order.can_cancel():
            return Response({"detail": "Order cannot be cancelled at this stage."},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(order, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"status": "Order cancelled successfully"})
