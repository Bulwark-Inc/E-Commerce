from django.contrib import admin, messages
from .models import UserProfile, Address
from permissions.models import Role, UserRole


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'birth_date', 'wants_to_be_writer', 'wants_to_be_host')
    search_fields = ('user__email', 'phone_number')
    actions = ['approve_writer_role', 'approve_host_role']

    @admin.action(description='Approve as Writer')
    def approve_writer_role(self, request, queryset):
        writer_role = Role.objects.filter(name__iexact='writer').first()
        if not writer_role:
            self.message_user(request, "Writer role not found.", level=messages.ERROR)
            return

        count = 0
        for profile in queryset.filter(wants_to_be_writer=True):
            user = profile.user
            user_role, created = UserRole.objects.get_or_create(user=user, role=writer_role)
            user_role.status = 'approved'
            user_role.save()

            profile.wants_to_be_writer = False
            profile.save()
            count += 1

        self.message_user(request, f"{count} user(s) approved as Writer.")

    @admin.action(description='Approve as Host')
    def approve_host_role(self, request, queryset):
        host_role = Role.objects.filter(name__iexact='host').first()
        if not host_role:
            self.message_user(request, "Host role not found.", level=messages.ERROR)
            return

        count = 0
        for profile in queryset.filter(wants_to_be_host=True):
            user = profile.user
            user_role, created = UserRole.objects.get_or_create(user=user, role=host_role)
            user_role.status = 'approved'
            user_role.save()

            profile.wants_to_be_host = False
            profile.save()
            count += 1

        self.message_user(request, f"{count} user(s) approved as Host.")
