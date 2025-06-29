from rest_framework import serializers
from .models import Notification
from django.contrib.contenttypes.models import ContentType


class NotificationSerializer(serializers.ModelSerializer):
    content_type = serializers.StringRelatedField()
    content_object_url = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'verb', 'description', 'is_read',
            'created_at', 'updated_at',
            'content_type', 'object_id', 'content_object_url'
        ]
        read_only_fields = ['id', 'created_at']

    def get_content_object_url(self, obj):
        if hasattr(obj.content_object, 'get_absolute_url'):
            return obj.content_object.get_absolute_url()
        return None
