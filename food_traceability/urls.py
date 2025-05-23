from django.contrib import admin
from django.urls import path, include 
from django.contrib.auth import views as auth_views
from django.conf import settings  
from django.conf.urls.static import static 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('traceability.urls')),  
    path('accounts/login/', auth_views.LoginView.as_view(template_name='admin/login.html'), name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/users/', include('users.urls')), 
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)