from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FoodItemViewSet, TransportLogViewSet

router = DefaultRouter()
router.register(r'food-items', FoodItemViewSet)
router.register(r'transport-logs', TransportLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/users/', include('users.urls')),
]