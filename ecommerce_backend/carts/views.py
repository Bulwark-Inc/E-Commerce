from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem, CartCoupon
from .serializers import CartSerializer, CartItemSerializer, CartCouponSerializer
from permissions.role_permissions import IsCartOwner


class CartViewSet(viewsets.GenericViewSet):
    """
    ViewSet for managing shopping carts.
    Only the owner or staff can view or modify the cart.
    """
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def get_cart(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart

    def list(self, request):
        cart = self.get_cart()
        self.check_object_permissions(request, cart)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    def clear(self, request):
        cart = self.get_cart()
        self.check_object_permissions(request, cart)
        cart.items.all().delete()
        CartCoupon.objects.filter(cart=cart).delete()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def apply_coupon(self, request):
        cart = self.get_cart()
        self.check_object_permissions(request, cart)
        serializer = CartCouponSerializer(data=request.data, context={'cart': cart})
        if serializer.is_valid():
            cart_coupon = serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'])
    def remove_coupon(self, request):
        cart = self.get_cart()
        self.check_object_permissions(request, cart)
        deleted, _ = CartCoupon.objects.filter(cart=cart).delete()
        if deleted:
            return Response({"message": "Coupon removed successfully"})
        return Response({"message": "No coupon applied to this cart"}, status=status.HTTP_404_NOT_FOUND)


class CartItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing cart items for authenticated users.
    """
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        cart = self.get_cart()
        return CartItem.objects.filter(cart=cart)

    def get_cart(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart

    def perform_create(self, serializer):
        cart = self.get_cart()
        serializer.save(cart=cart)

    def create(self, request, *args, **kwargs):
        cart = self.get_cart()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            product_id = serializer.validated_data['product_id']
            quantity = serializer.validated_data.get('quantity', 1)

            cart_item, created = CartItem.objects.get_or_create(cart=cart, product_id=product_id)
            if not created:
                cart_item.quantity += quantity
                cart_item.save()
            else:
                cart_item.quantity = quantity
                cart_item.save()

            return Response(self.get_serializer(cart_item).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None, partial=True):
        try:
            cart_item = CartItem.objects.get(id=pk, cart=self.get_cart())
        except CartItem.DoesNotExist:
            return Response({"detail": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(cart_item, data=request.data, partial=partial)
        if serializer.is_valid():
            if 'quantity' in serializer.validated_data and serializer.validated_data['quantity'] == 0:
                cart_item.delete()
                return Response({"detail": "Item removed from cart"}, status=status.HTTP_204_NO_CONTENT)

            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
