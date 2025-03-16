from django.db import models
from django.contrib.auth import get_user_model

CustomUser = get_user_model()

class FoodItem(models.Model):
    name = models.CharField(max_length=100)
    origin = models.CharField(max_length=100)
    batch_number = models.CharField(max_length=50, unique=True)
    farmer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'farmer'})
    created_at = models.DateTimeField(auto_now_add=True)
    qr_code = models.ImageField(upload_to='qr_codes/', null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.batch_number}"

class TransportLog(models.Model):
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    retailer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'retailer'})
    transport_date = models.DateTimeField()
    vehicle_details = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    on_shelf = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.food_item.name} to {self.destination}"

