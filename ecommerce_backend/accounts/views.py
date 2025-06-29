from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.conf import settings

from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from drf_spectacular.utils import extend_schema, OpenApiExample

from .serializers import (
    MyTokenObtainPairSerializer,
    RegisterSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer
)

User = get_user_model()


@extend_schema(
    request=MyTokenObtainPairSerializer,
    responses=MyTokenObtainPairSerializer,
    description="Authenticate user and return JWT access & refresh tokens.",
    examples=[
        OpenApiExample(
            name="Login Request Example",
            value={"email": "doctor@medinn.com", "password": "yourpassword"},
            request_only=True
        )
    ]
)
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@extend_schema(
    request=RegisterSerializer,
    responses={201: OpenApiExample(name="Registration Success", value={"detail": "User registered successfully"})},
    description="Register a new user. Requires unique email and matching passwords.",
    examples=[
        OpenApiExample(
            name="Register Example",
            value={
                "username": "medstudent1",
                "email": "medstudent@example.com",
                "password": "Password123!",
                "password2": "Password123!",
                "first_name": "Med",
                "last_name": "Student"
            },
            request_only=True
        )
    ]
)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


@extend_schema(
    request=PasswordResetRequestSerializer,
    responses={200: OpenApiExample(name="Success", value={"detail": "Password reset email sent."})},
    description="Request password reset. Sends a reset link to provided email.",
    examples=[
        OpenApiExample(
            name="Reset Email Request Example",
            value={"email": "user@example.com"},
            request_only=True
        )
    ]
)
class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

            send_mail(
                'Password Reset Request',
                f'Click the link to reset your password:\n{reset_url}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )

            return Response({"detail": "Password reset email sent."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)


@extend_schema(
    request=PasswordResetConfirmSerializer,
    responses={200: OpenApiExample(name="Success", value={"detail": "Password reset successful."})},
    description="Reset password using token in the reset link. Include new password in request body.",
    examples=[
        OpenApiExample(
            name="Password Reset Confirm Example",
            value={
                "token": "token-from-link",
                "password": "NewPassword123!",
                "password2": "NewPassword123!"
            },
            request_only=True
        )
    ]
)
class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = (AllowAny,)

    def post(self, request, uidb64, token):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)

            if not default_token_generator.check_token(user, token):
                return Response({"detail": "Token is invalid or expired."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(serializer.validated_data['password'])
            user.save()

            return Response({"detail": "Password reset successful."}, status=status.HTTP_200_OK)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Invalid password reset link."}, status=status.HTTP_400_BAD_REQUEST)
