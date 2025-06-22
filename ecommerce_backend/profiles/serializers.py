from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import UserProfile, Address

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = (
            'phone_number',
            'birth_date',
            'profile_picture',
            'wants_to_be_writer',
            'wants_to_be_host',
        )


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'profile',
            'roles'
        )
        read_only_fields = ('id', 'email', 'roles')

    def get_roles(self, obj):
        return list(obj.roles.values_list('role__name', flat=True))

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if profile_data:
            profile = instance.profile
            for attr, value in profile_data.items():
                setattr(profile, attr, value)

            # Auto-trigger role requests if flags are set
            from permissions.models import Role, UserRole

            if profile.wants_to_be_writer:
                try:
                    writer_role = Role.objects.get(name__iexact='writer')
                    UserRole.objects.get_or_create(user=instance, role=writer_role)
                except Role.DoesNotExist:
                    pass  # Optional: raise ValidationError or log

            if profile.wants_to_be_host:
                try:
                    host_role = Role.objects.get(name__iexact='host')
                    UserRole.objects.get_or_create(user=instance, role=host_role)
                except Role.DoesNotExist:
                    pass

            profile.save()

        instance.save()
        return instance


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = (
            'id', 'address_type', 'default', 'full_name', 'address_line1',
            'address_line2', 'city', 'state', 'postal_code', 'country', 'phone_number'
        )
        read_only_fields = ('id',)

    def create(self, validated_data):
        user = self.context['request'].user
        address = Address.objects.create(user=user, **validated_data)

        if address.default:
            Address.objects.filter(
                user=user,
                address_type=address.address_type,
                default=True
            ).exclude(id=address.id).update(default=False)

        return address

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if instance.default:
            Address.objects.filter(
                user=instance.user,
                address_type=instance.address_type,
                default=True
            ).exclude(id=instance.id).update(default=False)

        instance.save()
        return instance
