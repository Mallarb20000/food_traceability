from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLES = (
        ('farmer', 'Farmer'),
        ('retailer', 'Retailer'),
        ('consumer', 'Consumer'),
    )
    role = models.CharField(max_length=20, choices=ROLES, default='farmer')

    def __str__(self):
        return self.username