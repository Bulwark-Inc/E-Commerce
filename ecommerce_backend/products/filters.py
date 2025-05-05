import django_filters
from .models import Product, Category


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr='lte')
    category = django_filters.ModelMultipleChoiceFilter(
        field_name='category__slug',
        to_field_name='slug',
        queryset=Category.objects.filter(active=True)
    )
    parent_category = django_filters.ModelChoiceFilter(
        field_name='category__parent',
        queryset=Category.objects.filter(active=True, parent__isnull=True),
        method='filter_by_parent_category'
    )
    featured = django_filters.BooleanFilter(field_name='featured')
    
    class Meta:
        model = Product
        fields = ['min_price', 'max_price', 'category', 'featured']
    
    def filter_by_parent_category(self, queryset, name, value):
        return queryset.filter(
            category__parent=value
        )