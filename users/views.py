from rest_framework import generics
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

def create(self, request, *args, **kwargs):
    print("Received data:", request.data)  
    return super().create(request, *args, **kwargs)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


    
