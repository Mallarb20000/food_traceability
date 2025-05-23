# users/views.py

from datetime import timedelta
from django.conf import settings
from django.contrib.auth import get_user_model

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserSerializer, CustomTokenObtainPairSerializer

User = get_user_model()


class CreateUserView(generics.CreateAPIView):
    """Registers a new user."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    """Returns access, refresh, and role on login."""
    serializer_class = CustomTokenObtainPairSerializer


class CookieTokenObtainPairView(TokenObtainPairView):
    """Returns role + sets access/refresh tokens in cookies."""
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access = response.data.get("access")
            refresh = response.data.get("refresh")
            role = response.data.get("role")

            jwt_settings = settings.SIMPLE_JWT
            cookie_name = jwt_settings["AUTH_COOKIE"]
            secure = jwt_settings["AUTH_COOKIE_SECURE"]
            httponly = jwt_settings["AUTH_COOKIE_HTTP_ONLY"]
            samesite = jwt_settings["AUTH_COOKIE_SAMESITE"]
            access_lifetime = jwt_settings["ACCESS_TOKEN_LIFETIME"].total_seconds()
            refresh_lifetime = jwt_settings["REFRESH_TOKEN_LIFETIME"].total_seconds()

            response.set_cookie(
                key=cookie_name,
                value=access,
                max_age=access_lifetime,
                secure=secure,
                httponly=httponly,
                samesite=samesite,
            )
            response.set_cookie(
                key="refresh_token",
                value=refresh,
                max_age=refresh_lifetime,
                secure=secure,
                httponly=True,
                samesite=samesite,
            )

            response.data.clear()
            response.data["role"] = role

        return response


class LogoutView(APIView):
    """Logs the user out by clearing auth cookies."""
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        response = Response({"detail": "Logged out successfully."})
        response.delete_cookie(key=settings.SIMPLE_JWT['AUTH_COOKIE'], path='/')
        response.delete_cookie(key='refresh_token', path='/')
        return response
