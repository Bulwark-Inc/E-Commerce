from rest_framework import serializers
from .models import Role, UserRole

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name', 'description']

class UserRoleSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)

    class Meta:
        model = UserRole
        fields = ['id', 'role', 'status', 'requested_at']

class RoleRequestSerializer(serializers.Serializer):
    role_name = serializers.CharField()

    def validate_role_name(self, value):
        if not Role.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("Role not found.")
        return value
