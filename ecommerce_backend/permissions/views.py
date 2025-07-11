from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Role, UserRole
from .serializers import RoleSerializer, UserRoleSerializer, RoleRequestSerializer

class RoleListView(generics.ListAPIView):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.AllowAny]

class MyRolesView(generics.ListAPIView):
    serializer_class = UserRoleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserRole.objects.filter(user=self.request.user)

class RoleRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = RoleRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        role = Role.objects.get(name__iexact=serializer.validated_data['role_name'])
        obj, created = UserRole.objects.get_or_create(user=request.user, role=role)
        if not created:
            if obj.status == 'approved':
                return Response({"detail": "Role already approved."})
            return Response({"detail": f"Role request already {obj.status}."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Role request submitted."}, status=status.HTTP_201_CREATED)

class ApproveRoleView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        user_role = get_object_or_404(UserRole, pk=pk)
        user_role.status = 'approved'
        user_role.save()
        return Response({"detail": f"Role '{user_role.role.name}' approved for {user_role.user.email}."})

class DeclineRoleView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        user_role = get_object_or_404(UserRole, pk=pk)
        user_role.status = 'rejected'
        user_role.save()
        return Response({"detail": f"Role '{user_role.role.name}' rejected for {user_role.user.email}."})
