from rest_framework import serializers
from .models import Rating


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'value', 'created_at', 'updated_at']


class RatingCreateUpdateSerializer(serializers.ModelSerializer):
    value = serializers.IntegerField(min_value=1, max_value=5)

    class Meta:
        model = Rating
        fields = ['value']
