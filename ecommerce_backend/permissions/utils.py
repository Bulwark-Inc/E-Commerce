from .models import RolePermission, CustomPermission

def user_has_role(user, role_name):
    if not user or not user.is_authenticated:
        return False
    return user.roles.filter(role__name=role_name, status='approved').exists()

def user_has_permission(user, permission_code):
    if not user or not user.is_authenticated:
        return False
    if user.is_staff:
        return True
    return RolePermission.objects.filter(
        role__user_roles__user=user,
        role__user_roles__status='approved',
        permission__code=permission_code
    ).exists()
