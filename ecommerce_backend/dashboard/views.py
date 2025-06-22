from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from orders.models import Order
from profiles.models import Address
from housing.models import Listing  # upcoming app

User = get_user_model()

class AdminStatsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()
        total_addresses = Address.objects.count()
        total_listings = Listing.objects.count()
        return Response({
            'total_users': total_users,
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'total_addresses': total_addresses,
            'total_listings': total_listings,
        })
