from rest_framework import viewsets, permissions
from .models import Application
from .serializers import ApplicationSerializer
from housing.models import Housing
from permissions.models import Role, UserRole

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

        # Auto-assign tenant role if not already assigned
        tenant_role, _ = Role.objects.get_or_create(name='tenant')
        UserRole.objects.get_or_create(
            user=self.request.user,
            role=tenant_role,
            defaults={'status': 'approved'}
        )
