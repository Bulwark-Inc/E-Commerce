from rest_framework import serializers
from .models import Application
from housing.models import Housing
from housing.serializers import HousingSerializer


class ApplicationSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    housing = HousingSerializer(read_only=True)
    housing_id = serializers.PrimaryKeyRelatedField(
        queryset=Housing.objects.all(), source='housing', write_only=True
    )

    class Meta:
        model = Application
        fields = ['id', 'user', 'housing', 'housing_id', 'message', 'status', 'created_at']
        read_only_fields = ['user', 'status', 'created_at']
