from rest_framework import viewsets, permissions
from .models import Listing
from .serializers import ListingSerializer

class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all().order_by('-created_at')
    serializer_class = ListingSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, status='pending')

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        if self.action in ['create']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
