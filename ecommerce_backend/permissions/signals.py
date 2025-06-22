from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Role

@receiver(post_migrate)
def create_default_roles(sender, **kwargs):
    """
    Ensure essential roles exist after migration.
    Called after `migrate` to populate Role table.
    """
    default_roles = [
        'user',
        'admin',
        'writer',
        'host',
        'tenant',
        'product_manager',
    ]

    for role_name in default_roles:
        Role.objects.get_or_create(name=role_name.capitalize())
