from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Order
from .serializers import OrderSerializer, OrderCheckoutSerializer, OrderCancelSerializer
from .permissions import IsOrderOwnerOrManager
from permissions.role_permissions import IsOrderManager

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsOrderManager | IsOrderOwnerOrManager]
    lookup_field = 'pk'

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or IsOrderManager().has_permission(self.request, self):
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    def get_permissions(self):
        if self.action == 'cancel':
            return [permissions.IsAuthenticated(), IsOrderOwnerOrManager()]
        return super().get_permissions()

    @action(detail=False, methods=['post'], serializer_class=OrderCheckoutSerializer)
    def checkout(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], serializer_class=OrderCancelSerializer,
            permission_classes=[permissions.IsAuthenticated, IsOrderOwnerOrManager])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if not order.can_cancel():
            return Response({"detail": "Order cannot be cancelled at this stage."},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(order, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"status": "Order cancelled successfully"})
