from django.contrib import admin
from .models import Housing


@admin.register(Housing)
class HousingAdmin(admin.ModelAdmin):
    list_display = ['title', 'city', 'price_per_month', 'property_type', 'is_available', 'created_by']
    list_filter = ['property_type', 'is_available', 'city', 'state']
    search_fields = ['title', 'description', 'address', 'city']
