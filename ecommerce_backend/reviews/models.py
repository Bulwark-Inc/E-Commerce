from django.db import models
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)

    # Generic relation
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'content_type', 'object_id')  # 1 review per user per object

    def __str__(self):
        return f"{self.user.email} reviewed {self.content_type}({self.object_id})"
