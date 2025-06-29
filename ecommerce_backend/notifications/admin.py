from django.contrib import admin
from notifications.models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['recipient', 'verb', 'short_description', 'content_type', 'object_id', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at', 'content_type']
    search_fields = ['recipient__username', 'verb', 'description']
    readonly_fields = ['created_at']
    list_select_related = ['recipient']

    def short_description(self, obj):
        return (obj.description[:50] + '...') if obj.description and len(obj.description) > 50 else obj.description
    short_description.short_description = 'Description'
