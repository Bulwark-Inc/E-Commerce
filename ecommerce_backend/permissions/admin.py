from django.contrib import admin
from .models import Role, UserRole

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']

@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'status', 'requested_at']
    list_filter = ['status', 'role']
    search_fields = ['user__email']
