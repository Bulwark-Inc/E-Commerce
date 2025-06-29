from .models import Notification
from django.contrib.contenttypes.models import ContentType

def notify_user(recipient, actor, verb, description='', target=None):
    if recipient == actor:
        return  # Don't notify self

    content_type = ContentType.objects.get_for_model(target) if target else None
    object_id = target.pk if target else None

    Notification.objects.create(
        recipient=recipient,
        actor=actor,
        verb=verb,
        description=description,
        content_type=content_type,
        object_id=object_id
    )
