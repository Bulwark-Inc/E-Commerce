from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType

from .models import Post
from notifications.utils import notify_user

User = get_user_model()

@receiver(post_save, sender=Post)
def notify_on_post_save(sender, instance, created, **kwargs):
    author = instance.author
    if created:
        # New post created
        if instance.status == 'published':
            # Notify all admins (you could filter differently)
            admins = User.objects.filter(is_staff=True)
            for admin in admins:
                notify_user(
                    recipient=admin,
                    actor=author,
                    verb="published a new post",
                    description=instance.title,
                    target=instance
                )
        else:
            # Notify admin draft was created
            admins = User.objects.filter(is_staff=True)
            for admin in admins:
                notify_user(
                    recipient=admin,
                    actor=author,
                    verb="created a draft post",
                    description=instance.title,
                    target=instance
                )
    else:
        # Updated
        notify_user(
            recipient=author,
            actor=author,
            verb="updated your post",
            description=instance.title,
            target=instance
        )

@receiver(post_delete, sender=Post)
def notify_on_post_delete(sender, instance, **kwargs):
    author = instance.author
    admins = User.objects.filter(is_staff=True)
    for admin in admins:
        notify_user(
            recipient=admin,
            actor=author,
            verb="deleted a post",
            description=instance.title,
            target=instance
        )
