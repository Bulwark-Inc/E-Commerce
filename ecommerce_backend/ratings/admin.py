from django.contrib import admin
from ratings.models import Rating

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ['user', 'content_type', 'object_id', 'value', 'created_at']
    list_filter = ['content_type', 'value', 'created_at']
    search_fields = ['user__username']
    readonly_fields = ['created_at', 'updated_at']
