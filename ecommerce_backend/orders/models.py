from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    
    user = models.ForeignKey(User, related_name='orders', on_delete=models.CASCADE, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipping_address = models.ForeignKey('profiles.Address', related_name='shipping_orders', on_delete=models.PROTECT)
    billing_address = models.ForeignKey('profiles.Address', related_name='billing_orders', on_delete=models.PROTECT)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_price = models.DecimalField(max_digits=10, decimal_places=2)
    tracking_number = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.email if self.user else 'Guest'}"
    
    def can_cancel(self):
        return self.status == 'pending'
    
    def cancel(self):
        if self.can_cancel():
            self.status = 'cancelled'
            self.save()
            
            for item in self.items.all():
                product = item.product
                product.stock += item.quantity
                product.save()
            
            # NOTE: payment refund logic will move to payments app
            return True
        return False


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return f"{self.quantity}x {self.product.name} in Order #{self.order.id}"
    
    @property
    def total_price(self):
        return self.price * self.quantity
