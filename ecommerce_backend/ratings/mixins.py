from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Rating
from django.db.models import Avg

class AverageRatingMixin(serializers.Serializer):
    average_rating = serializers.SerializerMethodField()
    ratings_count = serializers.SerializerMethodField()

    def get_average_rating(self, obj):
        content_type = ContentType.objects.get_for_model(obj)
        ratings = Rating.objects.filter(content_type=content_type, object_id=obj.id)
        if ratings.exists():
            return round(ratings.aggregate(Avg('value'))['value__avg'], 1)
        return None

    def get_ratings_count(self, obj):
        content_type = ContentType.objects.get_for_model(obj)
        return Rating.objects.filter(content_type=content_type, object_id=obj.id).count()
