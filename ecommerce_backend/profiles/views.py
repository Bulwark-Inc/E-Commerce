from rest_framework import generics, viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Address
from .serializers import UserSerializer, AddressSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user


class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user).order_by('id')

    @action(detail=False, methods=['get'])
    def default_shipping(self, request):
        address = Address.objects.filter(user=request.user, address_type='shipping', default=True).first()
        if address:
            serializer = self.get_serializer(address)
            return Response(serializer.data)
        return Response({"detail": "Default shipping address not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def default_billing(self, request):
        address = Address.objects.filter(user=request.user, address_type='billing', default=True).first()
        if address:
            serializer = self.get_serializer(address)
            return Response(serializer.data)
        return Response({"detail": "Default billing address not found."}, status=status.HTTP_404_NOT_FOUND)