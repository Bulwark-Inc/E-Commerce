from rest_framework import generics, permissions
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')


class MarkNotificationAsReadView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()
    lookup_field = 'pk'

    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.recipient != self.request.user:
            raise permissions.PermissionDenied("You can only mark your own notifications.")
        instance.is_read = True
        instance.save()
