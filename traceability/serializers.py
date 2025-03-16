from rest_framework import serializers
from .models import FoodItem, TransportLog

class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = ['id', 'name', 'origin', 'batch_number', 'farmer', 'created_at','qr_code']
        read_only_fields = ['farmer', 'created_at']

class TransportLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportLog
        fields = ['id', 'food_item', 'retailer', 'transport_date', 'vehicle_details', 'destination', 'on_shelf']
        read_only_fields = ['retailer']