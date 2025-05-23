from django.urls import path
from .views import CreateUserView, CookieTokenObtainPairView, LogoutView

# user registration, login (JWT), and logout routes
urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('login/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout'),
    # path('profile/', ProfileView.as_view(), name='profile'),
]
