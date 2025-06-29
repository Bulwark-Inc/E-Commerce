from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'content_type', 'object_id', 'rating', 'created_at']
    list_filter = ['content_type', 'rating']
    search_fields = ['user__email', 'comment']
