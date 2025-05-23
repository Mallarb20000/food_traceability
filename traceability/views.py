from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import FoodItem, TransportLog
from .serializers import FoodItemSerializer, TransportLogSerializer
import qrcode
import os
from django.conf import settings

class FoodItemViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD operations for FoodItems.
    Public: anyone can view items.
    Authenticated: only farmers can create items.
    """
    serializer_class = FoodItemSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return FoodItem.objects.none() 
        if user.role == "retailer":
            return FoodItem.objects.all()
        return FoodItem.objects.filter(farmer=user)

    def perform_create(self, serializer):
        if self.request.user.role != 'farmer':
            raise PermissionDenied("Only farmers can create food items.")
        food_item = serializer.save(farmer=self.request.user)

        # Generate QR code linking to product page
        item_url = f"http://localhost:3000/product/{food_item.id}"
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(item_url)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white")

        # Save QR code image to media directory
        qr_dir = os.path.join(settings.MEDIA_ROOT, 'qr_codes')
        os.makedirs(qr_dir, exist_ok=True)
        qr_filename = f"food_item_{food_item.id}.png"
        qr_path = os.path.join(qr_dir, qr_filename)
        qr_img.save(qr_path)

        food_item.qr_code = f"qr_codes/{qr_filename}"
        food_item.save()

class TransportLogViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD operations for TransportLogs.
    Public: anyone can view logs.
    Authenticated: only retailers can create logs.
    """
    queryset = TransportLog.objects.all()
    serializer_class = TransportLogSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        if self.request.user.role != 'retailer':
            raise PermissionDenied("Only retailers can add transport logs.")
        serializer.save(retailer=self.request.user)
