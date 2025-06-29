from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Comment
from notifications.utils import notify_user

@receiver(post_save, sender=Comment)
def notify_author_on_comment(sender, instance, created, **kwargs):
    if not created:
        return

    comment = instance
    post = getattr(comment.content_object, 'post', None) or comment.content_object

    if hasattr(post, 'author'):
        notify_user(
            recipient=post.author,
            actor=comment.author,
            verb="commented on your post",
            description=comment.content[:100],
            target=post
        )
