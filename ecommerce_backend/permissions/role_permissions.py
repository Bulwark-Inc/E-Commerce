from rest_framework.permissions import BasePermission
from .models import UserRole

# === Global Role-Based Permissions ===

class HasApprovedRole(BasePermission):
    """
    Base permission to check if a user has one of the approved roles.
    Extend this class and set `required_roles`.
    """
    required_roles = []

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # Allow staff by default
        if request.user.is_staff:
            return True

        return UserRole.objects.filter(
            user=request.user,
            role__name__in=self.required_roles,
            status='approved'
        ).exists()


class IsProductManager(HasApprovedRole):
    required_roles = ['product_manager']


class IsWriter(HasApprovedRole):
    required_roles = ['writer']


class IsOrderManager(HasApprovedRole):
    required_roles = ['order_manager']


# === Object-Level Permissions ===

class IsCartOwner(BasePermission):
    """
    Allow access only to the owner of the cart or staff.
    """

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.is_staff
