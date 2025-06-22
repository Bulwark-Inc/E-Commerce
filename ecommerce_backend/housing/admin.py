from housing.models import Listing

class ListingAdminViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all()
    serializer_class = ListingAdminSerializer
    permission_classes = [permissions.IsAdminUser]

# and register in dashboard/urls.py under /housing/
