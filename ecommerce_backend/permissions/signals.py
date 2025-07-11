from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Role, CustomPermission, RolePermission
from .role_permissions import DEFAULT_ROLES, DEFAULT_PERMISSIONS, ROLE_PERMISSIONS_MAP

@receiver(post_migrate)
def seed_roles_permissions(sender, **kwargs):
    for name, desc in DEFAULT_ROLES.items():
        Role.objects.get_or_create(name=name, defaults={"description": desc})

    for code, desc in DEFAULT_PERMISSIONS.items():
        CustomPermission.objects.get_or_create(code=code, defaults={"description": desc})

    for role_name, perm_codes in ROLE_PERMISSIONS_MAP.items():
        role = Role.objects.get(name=role_name)
        for code in perm_codes:
            permission = CustomPermission.objects.get(code=code)
            RolePermission.objects.get_or_create(role=role, permission=permission)
