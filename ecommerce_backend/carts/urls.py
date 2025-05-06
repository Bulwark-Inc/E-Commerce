from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('', views.CartViewSet, basename='cart')
router.register('items', views.CartItemViewSet, basename='cart-items')

urlpatterns = [
    path('', include(router.urls)),
    path('clear/', views.CartViewSet.as_view({'post': 'clear'}), name='cart-clear'),
]