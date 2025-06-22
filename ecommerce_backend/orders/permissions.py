from rest_framework.permissions import BasePermission, SAFE_METHODS
from permissions.role_permissions import IsOrderManager


class IsOrderOwnerOrManager(BasePermission):
    """
    Custom permission: Only order owner, staff, or order manager can access.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        if IsOrderManager().has_permission(request, view):
            return True
        return obj.user == request.user
