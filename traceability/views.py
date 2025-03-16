from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import FoodItem, TransportLog
from .serializers import FoodItemSerializer, TransportLogSerializer
import qrcode
from PIL import Image
import os
from django.conf import settings

class FoodItemViewSet(viewsets.ModelViewSet):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Check if the user is a farmer
        if self.request.user.role != 'farmer':
            raise PermissionDenied("Only farmers can create food items.")
        
        # Save the FoodItem instance
        food_item = serializer.save(farmer=self.request.user)
        
        # Generate QR code linking to this item's API endpoint
        item_url = f"http://127.0.0.1:8000/api/food-items/{food_item.id}/"
        qr = qrcode.QRCode(
            version=1,  # Size of QR code
            error_correction=qrcode.constants.ERROR_CORRECT_L,  # Error correction level
            box_size=10,  # Pixel size of each box
            border=4,  # Border thickness
        )
        qr.add_data(item_url)
        qr.make(fit=True)
        
        # Create QR code image
        qr_img = qr.make_image(fill_color="black", back_color="white")
        
        # Save QR code to media directory
        qr_filename = f"food_item_{food_item.id}.png"
        qr_path = os.path.join(settings.MEDIA_ROOT, 'qr_codes', qr_filename)
        os.makedirs(os.path.dirname(qr_path), exist_ok=True)  # Create directory if it doesn’t exist
        qr_img.save(qr_path)
        
        # Update the FoodItem with the QR code path
        food_item.qr_code = f"qr_codes/{qr_filename}"
        food_item.save()

class TransportLogViewSet(viewsets.ModelViewSet):
    queryset = TransportLog.objects.all()
    serializer_class = TransportLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Check if the user is a retailer
        if self.request.user.role != 'retailer':
            raise PermissionDenied("Only retailers can add transport logs.")
        serializer.save(retailer=self.request.user)