from django.urls import path
from .views import CreateUserView, CustomTokenObtainPairView
from rest_framework.authtoken.views import obtain_auth_token
from django.urls import path, include
urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    
]
