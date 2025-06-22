from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'payment_method', 'transaction_id', 'reference', 'amount', 'status', 'created_at']
        read_only_fields = ['transaction_id', 'reference', 'amount', 'status', 'created_at']
