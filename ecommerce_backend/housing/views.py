from rest_framework import viewsets, permissions
from .models import Housing
from .serializers import HousingSerializer
from .permissions import IsHost
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from comments.views import GenericCommentListCreateView
from ratings.views import GenericRatingCreateUpdateView
from reviews.views import GenericReviewListCreateView



class HousingViewSet(viewsets.ModelViewSet):
    queryset = Housing.objects.all().order_by('-created_at')
    serializer_class = HousingSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['city', 'state', 'country', 'price_per_month', 'property_type', 'is_available']
    search_fields = ['title', 'description', 'city', 'state']
    ordering_fields = ['price_per_month', 'created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsHost()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# COMMENTS: Generic comment view for Housing
class HousingCommentsView(GenericCommentListCreateView):
    def get_model(self):
        from .models import Housing
        return Housing


# RATINGS: Generic rating view for Housing
class HousingRatingView(GenericRatingCreateUpdateView):
    def get_model(self):
        from .models import Housing
        return Housing


# REVIEWS: Generic review view for Housing
class HousingReviewListCreateView(GenericReviewListCreateView):
    def get_model(self):
        from .models import Housing
        return Housing
