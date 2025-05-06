from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem, CartCoupon
from .serializers import CartSerializer, CartItemSerializer, CartCouponSerializer

class CartViewSet(viewsets.GenericViewSet):
    """
    ViewSet for managing shopping carts
    """
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
    
    def get_cart(self):
        """Get or create a cart for the current user"""
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart
    
    def list(self, request):
        """
        Get the current user's cart
        """
        cart = self.get_cart()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)
    
    def clear(self, request):
        """
        Clear all items from the cart
        """
        cart = self.get_cart()
        cart.items.all().delete()
        
        # Remove any applied coupon
        CartCoupon.objects.filter(cart=cart).delete()
        
        serializer = self.get_serializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def apply_coupon(self, request):
        """
        Apply a coupon code to the cart
        """
        cart = self.get_cart()
        serializer = CartCouponSerializer(
            data=request.data,
            context={'cart': cart}
        )
        
        if serializer.is_valid():
            cart_coupon = serializer.save()
            return Response(serializer.data)
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=False, methods=['delete'])
    def remove_coupon(self, request):
        """
        Remove applied coupon from cart
        """
        cart = self.get_cart()
        result = CartCoupon.objects.filter(cart=cart).delete()
        
        if result[0] > 0:
            return Response({"message": "Coupon removed successfully"})
        
        return Response(
            {"message": "No coupon applied to this cart"},
            status=status.HTTP_404_NOT_FOUND
        )


class CartItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing cart items
    """
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        cart = self.get_cart()
        return CartItem.objects.filter(cart=cart)
    
    def get_cart(self):
        """Get or create a cart for the current user"""
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart
    
    def create(self, request):
        """
        Add an item to the cart
        """
        cart = self.get_cart()
        
        # Add cart to serializer context
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            product_id = serializer.validated_data['product_id']
            quantity = serializer.validated_data.get('quantity', 1)
            
            # Try to get existing cart item
            try:
                cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
                # Update quantity
                cart_item.quantity += quantity
                cart_item.save()
            except CartItem.DoesNotExist:
                # Create new cart item
                cart_item = CartItem.objects.create(
                    cart=cart,
                    product_id=product_id,
                    quantity=quantity
                )
            
            updated_serializer = self.get_serializer(cart_item)
            return Response(updated_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk=None, partial=True):
        """
        Update quantity for a cart item
        """
        try:
            cart_item = CartItem.objects.get(id=pk, cart=self.get_cart())
        except CartItem.DoesNotExist:
            return Response(
                {"detail": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(cart_item, data=request.data, partial=partial)

        if serializer.is_valid():
            if 'quantity' in serializer.validated_data:
                if serializer.validated_data['quantity'] == 0:
                    cart_item.delete()
                    return Response(
                        {"detail": "Item removed from cart"},
                        status=status.HTTP_204_NO_CONTENT
                    )
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
