from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FoodItemViewSet, TransportLogViewSet

# DRF router to automatically handle RESTful endpoints
router = DefaultRouter()
router.register(r'food-items', FoodItemViewSet, basename='fooditem')
router.register(r'transport-logs', TransportLogViewSet)

# Main API routes
urlpatterns = [
    path('', include(router.urls)),                # main API routes for food items and transport logs
    path('api/users/', include('users.urls')),     # nested route for user-related APIs (e.g. register, login)
]
