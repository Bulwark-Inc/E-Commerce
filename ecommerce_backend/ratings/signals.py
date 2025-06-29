from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Rating
from notifications.utils import notify_user

@receiver(post_save, sender=Rating)
def notify_author_on_rating(sender, instance, created, **kwargs):
    if not created:
        return

    rated_object = instance.content_object

    if hasattr(rated_object, 'author'):
        notify_user(
            recipient=rated_object.author,
            actor=instance.user,
            verb="rated your post",
            description=f"Rating: {instance.value}",
            target=rated_object
        )
