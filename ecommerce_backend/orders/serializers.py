from rest_framework import serializers
from .models import Order, OrderItem
from orders.services.order_service import create_order
from products.models import Product
from profiles.models import Address
from profiles.serializers import AddressSerializer
from payments.models import Payment  # cross-app import
from payments.serializers import PaymentSerializer
from carts.models import Cart, CartItem, CartCoupon
import secrets


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'price', 'quantity', 'total_price']
        read_only_fields = ['price', 'total_price']

    def get_product_image(self, obj):
        try:
            product = obj.product
            image = product.images.filter(is_primary=True).first()
            return image.image.url if image and image.image else None
        except Exception:
            return None


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
        raise NotImplementedError("Use OrderCheckoutSerializer for order creation.")

    def validate(self, data):
        user = self.context['request'].user
        for field in ['shipping_address_id', 'billing_address_id']:
            address_id = data.get(field)
            if not Address.objects.filter(id=address_id, user=user).exists():
                raise serializers.ValidationError({field: "Invalid or unauthorized address."})
        return data


class OrderCancelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = []

    def update(self, instance, validated_data):
        if not instance.cancel():
            raise serializers.ValidationError("Order cannot be cancelled.")
        return instance


class OrderCheckoutSerializer(serializers.Serializer):
    shipping_address_id = serializers.IntegerField()
    billing_address_id = serializers.IntegerField()
    shipping_price = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate(self, data):
        user = self.context['request'].user

        try:
            data['shipping_address'] = Address.objects.get(id=data['shipping_address_id'], user=user)
            data['billing_address'] = Address.objects.get(id=data['billing_address_id'], user=user)
        except Address.DoesNotExist:
            raise serializers.ValidationError("Invalid shipping or billing address.")

        try:
            data['cart'] = Cart.objects.prefetch_related('items__product').get(user=user)
        except Cart.DoesNotExist:
            raise serializers.ValidationError("Cart not found.")

        if not data['cart'].items.exists():
            raise serializers.ValidationError("Cart is empty.")

        return data

    def create(self, validated_data):
        return create_order(
            user=self.context['request'].user,
            cart=validated_data['cart'],
            shipping_address=validated_data['shipping_address'],
            billing_address=validated_data['billing_address'],
            shipping_price=validated_data['shipping_price']
        )
