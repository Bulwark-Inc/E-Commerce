from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    MyTokenObtainPairView,
    RegisterView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
)

urlpatterns = [
    path('auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('auth/password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
