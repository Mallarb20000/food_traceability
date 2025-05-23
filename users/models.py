from django.contrib.auth.models import AbstractUser
from django.db import models

# extends default Django user with a role field
class CustomUser(AbstractUser):
    ROLES = (
        ('farmer', 'Farmer'),
        ('retailer', 'Retailer'),
        ('consumer', 'Consumer'),  # not  used right now 
    )
    role = models.CharField(max_length=20, choices=ROLES, default='farmer')  

    def __str__(self):
        return self.username  
