from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

User = get_user_model()

class Rating(models.Model):
    RATING_CHOICES = [(i, f"{i} Stars") for i in range(1, 6)]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings')
    value = models.PositiveSmallIntegerField(choices=RATING_CHOICES)

    # Generic foreign key to target any model (blog post, product, etc.)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    is_flagged = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'content_type', 'object_id')
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
        ]

    def __str__(self):
        return f"{self.user} rated {self.value} for {self.content_object}"
