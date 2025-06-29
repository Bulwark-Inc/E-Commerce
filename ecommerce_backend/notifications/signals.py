from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from comments.models import Comment
from .models import Notification

@receiver(post_save, sender=Comment)
def notify_author_on_comment(sender, instance, created, **kwargs):
    if created and instance.content_object:
        content_object = instance.content_object
        content_type = ContentType.objects.get_for_model(content_object.__class__)

        # Only notify if the author is not the one commenting
        if hasattr(content_object, 'author') and instance.author != content_object.author:
            Notification.objects.create(
                recipient=content_object.author,
                verb="commented on your post",
                description=instance.content,
                content_type=content_type,
                object_id=content_object.id
            )
