import django_filters
from .models import Order


class OrderFilter(django_filters.FilterSet):
    min_total = django_filters.NumberFilter(field_name="total_price", lookup_expr='gte')
    max_total = django_filters.NumberFilter(field_name="total_price", lookup_expr='lte')
    is_paid = django_filters.BooleanFilter(field_name="is_paid")
    status = django_filters.CharFilter(field_name="status")
    created_after = django_filters.DateTimeFilter(field_name="created_at", lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name="created_at", lookup_expr='lte')

    class Meta:
        model = Order
        fields = ['min_total', 'max_total', 'is_paid', 'status', 'created_after', 'created_before']
