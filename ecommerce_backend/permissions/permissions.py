from rest_framework import permissions
from .utils import user_has_permission

class HasCustomPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        required_permission = getattr(view, 'required_permission', None)
        if required_permission:
            return user_has_permission(request.user, required_permission)
        return True
