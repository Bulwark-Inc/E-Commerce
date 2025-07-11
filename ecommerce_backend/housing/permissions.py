from rest_framework import permissions
from permissions.utils import user_has_role


class IsHost(permissions.BasePermission):
    """
    Custom permission that checks if the user has an approved 'host' role.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and user_has_role(request.user, 'host')
