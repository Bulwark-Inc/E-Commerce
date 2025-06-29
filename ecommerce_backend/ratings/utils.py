from ratings.models import Rating
from django.contrib.contenttypes.models import ContentType


def get_average_rating(obj):
    content_type = ContentType.objects.get_for_model(obj)
    ratings = Rating.objects.filter(content_type=content_type, object_id=obj.id)
    if not ratings.exists():
        return None
    return round(ratings.aggregate(avg=models.Avg('value'))['avg'], 1)
