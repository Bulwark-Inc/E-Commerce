from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

User = settings.AUTH_USER_MODEL

class Cart(models.Model):
    """
    Cart model that can be associated with an authenticated user.
    """
    user = models.OneToOneField(User, related_name='cart', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Cart {self.id} - {'User: ' + self.user.email if self.user else 'Anonymous'}"
    
    @property
    def total_price(self):
        """Calculate total price of all items in cart"""
        return sum(item.total_price for item in self.items.all())
    
    @property
    def item_count(self):
        """Get the total number of items in the cart"""
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    """
    Cart item representing a product in a cart with quantity.
    """
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(20)]  # Max 20 of the same item
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('cart', 'product')  # Prevent duplicate products in cart
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Cart {self.cart.id}"
    
    @property
    def total_price(self):
        """Calculate total price for this item (quantity * price)"""
        return self.product.price * self.quantity
    
    def clean(self):
        """Validate item against product availability"""
        from django.core.exceptions import ValidationError
        
        # Check if requested quantity is available
        if self.quantity > self.product.stock:
            raise ValidationError(f"Only {self.product.stock} units of {self.product.name} available.")
        
        # Check if product is available for purchase
        if not self.product.available:
            raise ValidationError(f"Product {self.product.name} is not available for purchase.")


class Coupon(models.Model):
    """
    Discount coupon that can be applied to a cart.
    """
    code = models.CharField(max_length=50, unique=True)
    discount_percentage = models.PositiveIntegerField(
        default=0,
        validators=[MaxValueValidator(100)]
    )
    discount_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0
    )
    active = models.BooleanField(default=True)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    min_purchase_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.code
    
    @property
    def is_valid(self):
        """Check if coupon is currently valid"""
        from django.utils import timezone
        now = timezone.now()
        return self.active and self.valid_from <= now <= self.valid_to


class CartCoupon(models.Model):
    """
    Association between a Cart and an applied Coupon.
    """
    cart = models.OneToOneField(Cart, related_name='applied_coupon', on_delete=models.CASCADE)
    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE)
    applied_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Coupon {self.coupon.code} applied to Cart {self.cart.id}"
    
    @property
    def discount_value(self):
        """Calculate the discount value based on coupon type and cart total"""
        cart_total = self.cart.total_price
        
        # Calculate discount based on percentage
        if self.coupon.discount_percentage > 0:
            return (cart_total * self.coupon.discount_percentage) / 100
        
        # Return fixed discount amount
        return self.coupon.discount_amount
    
    @property
    def final_total(self):
        """Calculate final total after coupon discount"""
        return max(0, self.cart.total_price - self.discount_value)