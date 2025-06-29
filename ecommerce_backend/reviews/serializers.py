from rest_framework import serializers
from .models import Review
from django.contrib.contenttypes.models import ContentType


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    content_type = serializers.SlugRelatedField(
        queryset=ContentType.objects.all(),
        slug_field='model'
    )

    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'content_type', 'object_id', 'created_at']
        read_only_fields = ['user', 'created_at']
