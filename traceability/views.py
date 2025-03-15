from rest_framework import viewsets, permissions
from .models import FoodItem, TransportLog
from .serializers import FoodItemSerializer, TransportLogSerializer

class FoodItemViewSet(viewsets.ModelViewSet):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != 'farmer':
            raise permissions.PermissionDenied("Only farmers can create food items.")
        serializer.save(farmer=self.request.user)

class TransportLogViewSet(viewsets.ModelViewSet):
    queryset = TransportLog.objects.all()
    serializer_class = TransportLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != 'retailer':
            raise permissions.PermissionDenied("Only retailers can add transport logs.")
        serializer.save(retailer=self.request.user)