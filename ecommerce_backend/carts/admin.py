from django.contrib import admin
from .models import Cart, CartItem, Coupon, CartCoupon

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['total_price']

class CartCouponInline(admin.TabularInline):
    model = CartCoupon
    extra = 0
    readonly_fields = ['discount_value', 'final_total']

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'item_count', 'total_price', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__email', 'user__username']
    readonly_fields = ['total_price', 'item_count']
    inlines = [CartItemInline, CartCouponInline]

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_percentage', 'discount_amount', 'active', 'valid_from', 'valid_to']
    list_filter = ['active', 'valid_from', 'valid_to']
    search_fields = ['code']