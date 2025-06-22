from django.contrib import admin
from django.utils.html import format_html
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'payment_method', 'amount', 'colored_status', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['order__id', 'transaction_id', 'reference']
    readonly_fields = ['created_at', 'updated_at', 'transaction_id', 'reference', 'status']

    def colored_status(self, obj):
        color = {
            'pending': 'orange',
            'completed': 'green',
            'failed': 'red',
            'refunded': 'blue',
        }.get(obj.status, 'black')
        return format_html(f'<strong style="color: {color}">{obj.get_status_display()}</strong>')

    colored_status.short_description = 'Status'
