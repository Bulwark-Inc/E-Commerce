from .models import Notification
from django.contrib.contenttypes.models import ContentType

def notify_user(recipient, actor, verb, type, description='', target=None):
    if recipient == actor:
        return  # Avoid notifying self

    content_type = ContentType.objects.get_for_model(target) if target else None
    object_id = target.pk if target else None

    Notification.objects.create(
        recipient=recipient,
        actor=actor,
        verb=verb,
        type=type,
        description=description,
        content_type=content_type,
        object_id=object_id
    )
