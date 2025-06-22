from rest_framework import serializers
from django.contrib.auth import get_user_model
from orders.models import Order
from housing.models import Listing

User = get_user_model()

class UserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'is_active', 'is_staff', 'is_verified']

class OrderAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class ListingAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = '__all__'
