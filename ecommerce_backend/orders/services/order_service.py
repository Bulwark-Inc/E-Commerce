from django.db import transaction
from django.utils.crypto import get_random_string
from payments.models import Payment
from carts.models import CartCoupon
from orders.models import Order, OrderItem

def validate_product_stock(cart_items):
    for item in cart_items:
        product = item.product
        if not product.available or product.stock < item.quantity:
            raise ValueError(f"Product '{product.name}' is unavailable or has insufficient stock.")

def reduce_product_stock(cart_items):
    for item in cart_items:
        product = item.product
        product.stock -= item.quantity
        product.save()

def create_payment(order, amount, method='paystack'):
    reference = f"{order.id}-{get_random_string(12)}"
    Payment.objects.create(
        order=order,
        amount=amount,
        reference=reference,
        payment_method=method
    )

@transaction.atomic
def create_order(user, cart, shipping_address, billing_address, shipping_price):
    cart_total = cart.total_price
    total_price = cart_total + shipping_price

    if getattr(cart, 'applied_coupon', None):
        total_price = cart.applied_coupon.final_total + shipping_price

    validate_product_stock(cart.items.all())

    order = Order.objects.create(
        user=user,
        shipping_address=shipping_address,
        billing_address=billing_address,
        shipping_price=shipping_price,
        total_price=total_price
    )

    for item in cart.items.all():
        OrderItem.objects.create(
            order=order,
            product=item.product,
            price=item.product.discount_price or item.product.price,
            quantity=item.quantity
        )

    reduce_product_stock(cart.items.all())
    cart.items.all().delete()
    CartCoupon.objects.filter(cart=cart).delete()
    create_payment(order, total_price)

    return order
