from rest_framework.permissions import BasePermission
from .models import Application


class IsApplicant(BasePermission):
    """
    Permission for tenants to view or cancel their own applications.
    """

    def has_object_permission(self, request, view, obj: Application):
        return obj.user == request.user or request.user.is_staff


class IsListingOwner(BasePermission):
    """
    Permission for hosts to manage applications to their listings.
    """

    def has_object_permission(self, request, view, obj: Application):
        return obj.housing.created_by == request.user or request.user.is_staff
