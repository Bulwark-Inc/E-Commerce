from rest_framework import serializers
from .models import Rating

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'value', 'content_type', 'object_id', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        user = self.context['request'].user
        content_type = validated_data['content_type']
        object_id = validated_data['object_id']
        value = validated_data['value']

        rating, _ = Rating.objects.update_or_create(
            user=user,
            content_type=content_type,
            object_id=object_id,
            defaults={'value': value}
        )
        return rating
