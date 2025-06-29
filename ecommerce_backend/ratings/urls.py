from django.urls import path
from .views import GenericRatingCreateUpdateView

urlpatterns = [
    path('rate/', GenericRatingCreateUpdateView.as_view(), name='rate-object'),
]
