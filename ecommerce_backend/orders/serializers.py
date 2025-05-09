from rest_framework import serializers
from .models import Order, OrderItem, Payment
from products.models import Product
from users.models import Address
from users.serializers import AddressSerializer
import uuid
import secrets


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'price', 'quantity', 'total_price']
        read_only_fields = ['price', 'total_price']
    
    def get_product_image(self, obj):
        image_url = None
        try:
            product = obj.product
            if product:
                image_obj = product.images.filter(is_primary=True).first()
                if image_obj and image_obj.image:
                    image_url = image_obj.image.url
        except Exception:
            pass
        return image_url



class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'payment_method', 'transaction_id', 'reference', 'amount', 'status', 'created_at']
        read_only_fields = ['transaction_id', 'reference', 'amount', 'status', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment = PaymentSerializer(read_only=True)
    shipping_address = AddressSerializer(read_only=True)
    billing_address = AddressSerializer(read_only=True)
    shipping_address_id = serializers.IntegerField(write_only=True)
    billing_address_id = serializers.IntegerField(write_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    can_cancel = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'status', 'status_display', 'shipping_address', 'billing_address',
            'shipping_address_id', 'billing_address_id', 'total_price', 'shipping_price',
            'tracking_number', 'items', 'payment', 'created_at', 'updated_at', 'can_cancel'
        ]
        read_only_fields = ['user', 'status', 'total_price', 'tracking_number', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # Get current user
        user = self.context['request'].user
        
        # Check if user has items in cart
        if not hasattr(user, 'cart') or user.cart.items.count() == 0:
            raise serializers.ValidationError({"cart": "Your cart is empty"})
        
        # Calculate total price from cart
        cart = user.cart
        cart_total = sum(item.total_price for item in cart.items.all())
        shipping_price = validated_data.get('shipping_price', 10.00)  # Default shipping price
        total_price = cart_total + shipping_price
        
        # Create order
        order = Order.objects.create(
            user=user,
            shipping_address_id=validated_data['shipping_address_id'],
            billing_address_id=validated_data['billing_address_id'],
            total_price=total_price,
            shipping_price=shipping_price,
        )
        
        # Create order items from cart items
        for cart_item in cart.items.all():
            product = cart_item.product
            
            # Check if product is available and has enough stock
            if not product.available or product.stock < cart_item.quantity:
                order.delete()
                raise serializers.ValidationError({
                    "product": f"Product '{product.name}' is unavailable or has insufficient stock"
                })
            
            # Create order item
            OrderItem.objects.create(
                order=order,
                product=product,
                price=product.discount_price if product.discount_price else product.price,
                quantity=cart_item.quantity
            )
            
            # Update product stock
            product.stock -= cart_item.quantity
            product.save()
        
        # Generate payment reference
        reference = f"PAY-{secrets.token_hex(8)}-{order.id}"
        
        # Create payment record
        Payment.objects.create(
            order=order,
            reference=reference,
            amount=total_price
        )
        
        # Clear the cart
        cart.items.all().delete()
        
        return order
    
    def validate(self, data):
        user = self.context['request'].user

        # Check address existence and ownership
        for field in ['shipping_address_id', 'billing_address_id']:
            address_id = data.get(field)
            try:
                address = Address.objects.get(id=address_id, user=user)
            except Address.DoesNotExist:
                raise serializers.ValidationError({field: "Invalid or unauthorized address."})
        
        return data


class OrderCancelSerializer(serializers.Serializer):
    def update(self, instance, validated_data):
        success = instance.cancel()
        if not success:
            raise serializers.ValidationError({"status": "This order cannot be cancelled"})
        return instance