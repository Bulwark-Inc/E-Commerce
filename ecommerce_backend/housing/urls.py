from django.urls import path, include
from .views import HousingViewSet, HousingCommentsView, HousingRatingView, HousingReviewListCreateView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', HousingViewSet, basename='housing')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:pk>/comments/', HousingCommentsView.as_view(), name='housing-comments'),
    path('<int:pk>/rate/', HousingRatingView.as_view(), name='housing-rate'),
    path('<int:pk>/reviews/', HousingReviewListCreateView.as_view(), name='housing-reviews'),
]
