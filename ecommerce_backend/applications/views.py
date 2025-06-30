from rest_framework import viewsets, permissions
from .models import Application
from .serializers import ApplicationSerializer
from housing.models import Housing
from permissions.models import Role, UserRole
from notifications.utils import notify_user

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.roles.filter(role__name='host', status='approved').exists():
            return Application.objects.select_related('housing').filter(housing__created_by=user)

        return Application.objects.filter(user=user)

    def perform_create(self, serializer):
        application = serializer.save(user=self.request.user)

        # Auto-assign tenant role
        tenant_role, _ = Role.objects.get_or_create(name='tenant')
        UserRole.objects.get_or_create(
            user=self.request.user,
            role=tenant_role,
            defaults={'status': 'approved'}
        )

        # Notify the housing owner
        housing_owner = application.housing.created_by
        if housing_owner != self.request.user:
            notify_user(
                recipient=housing_owner,
                actor=self.request.user,
                verb='applied to your listing',
                type='comment',  # reuse 'comment' type or define new type like 'application'
                description=application.message,
                target=application
            )

    def perform_update(self, serializer):
        prev_status = self.get_object().status
        application = serializer.save()

        # Notify the applicant on status change
        if prev_status != application.status:
            notify_user(
                recipient=application.user,
                actor=self.request.user,
                verb=f"{application.status.lower()} your application",
                type='comment',  # or 'status' if you define new types
                description=f"Your application to '{application.housing.title}' is now {application.status.lower()}.",
                target=application
            )