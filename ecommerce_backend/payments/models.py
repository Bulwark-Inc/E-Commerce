from django.db import models
from orders.models import Order

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = (
        ('paystack', 'Paystack'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )

    order = models.OneToOneField(Order, related_name='payment', on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='paystack')
    transaction_id = models.CharField(max_length=100, blank=True)
    reference = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment for Order #{self.order.id} - {self.get_status_display()}"
