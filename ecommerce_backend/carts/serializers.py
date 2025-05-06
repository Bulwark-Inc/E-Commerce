from rest_framework import serializers
from django.utils import timezone
from .models import Cart, CartItem, Coupon, CartCoupon
from products.serializers import ProductListSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(write_only=True)
    product = ProductListSerializer(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    price_changed = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'product', 'quantity', 'total_price', 'price_changed']
        read_only_fields = ['id', 'total_price', 'price_changed']
    
    def get_price_changed(self, obj):
        """
        Check if the product's price has changed since it was added to the cart
        """
        # Compare last update time with cart item creation time
        return obj.product.updated_at > obj.created_at and obj.product.price != obj.product.price
    
    def validate(self, data):
        product_id = data.get('product_id', getattr(self.instance, 'product_id', None))
        quantity = data.get('quantity', getattr(self.instance, 'quantity', 1))
        
        if not product_id:
            raise serializers.ValidationError("Product ID is required")

        from products.models import Product
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product does not exist")

        if not product.available:
            raise serializers.ValidationError("This product is not available for purchase")

        if quantity > product.stock:
            raise serializers.ValidationError(f"Only {product.stock} units available")

        return data


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    has_price_changes = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price', 'item_count', 'has_price_changes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_has_price_changes(self, obj):
        """Check if any items in the cart have price changes"""
        for item in obj.items.all():
            if item.product.updated_at > item.created_at and item.product.price != item.product.price:
                return True
        return False


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount_percentage', 'discount_amount', 'valid_from', 'valid_to', 'min_purchase_amount']
        read_only_fields = ['id']


class CartCouponSerializer(serializers.ModelSerializer):
    coupon = CouponSerializer(read_only=True)
    coupon_code = serializers.CharField(write_only=True)
    discount_value = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    final_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = CartCoupon
        fields = ['id', 'coupon', 'coupon_code', 'discount_value', 'final_total', 'applied_at']
        read_only_fields = ['id', 'discount_value', 'final_total', 'applied_at']
    
    def validate_coupon_code(self, code):
        now = timezone.now()
        try:
            coupon = Coupon.objects.get(
                code=code,
                active=True,
                valid_from__lte=now,
                valid_to__gte=now
            )
        except Coupon.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired coupon code")
        
        # Check if cart meets minimum purchase requirement
        cart = self.context.get('cart')
        if cart and cart.total_price < coupon.min_purchase_amount:
            min_amount = coupon.min_purchase_amount
            raise serializers.ValidationError(
                f"This coupon requires a minimum purchase of ${min_amount}"
            )
        
        return code
    
    def create(self, validated_data):
        coupon_code = validated_data.pop('coupon_code')
        coupon = Coupon.objects.get(code=coupon_code)
        cart = self.context.get('cart')
        
        # Check if cart already has a coupon and delete it
        CartCoupon.objects.filter(cart=cart).delete()
        
        # Create new coupon association
        cart_coupon = CartCoupon.objects.create(
            cart=cart,
            coupon=coupon
        )
        
        return cart_coupon