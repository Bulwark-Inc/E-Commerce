from django.urls import path
from .views import ReviewDetailView

urlpatterns = [
    path('<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
]
