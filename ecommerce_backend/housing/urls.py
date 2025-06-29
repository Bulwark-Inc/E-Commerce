from rest_framework.routers import DefaultRouter
from .views import HousingViewSet

router = DefaultRouter()
router.register(r'', HousingViewSet, basename='housing')

urlpatterns = router.urls
