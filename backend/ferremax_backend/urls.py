# backend/ferremax_project/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from rest_framework_simplejwt.views import TokenObtainPairView # Importa la vista base para pasar serializer
from core.serializers import MyTokenObtainPairSerializer # Importa tu serializer personalizado
from core.views import RegisterUserView, UserListCreateAPIView, UserRetrieveUpdateDestroyAPIView, RolListAPIView # <-- NUEVAS IMPORTACIONES

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')), # Tus URLs de 'core'

    # Rutas para JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(serializer_class=MyTokenObtainPairSerializer), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Rutas para Registro y Mantenedor de Usuario
    path('api/register/', RegisterUserView.as_view(), name='register'),
    path('api/users/', UserListCreateAPIView.as_view(), name='user-list-create'),
    path('api/users/<int:pk>/', UserRetrieveUpdateDestroyAPIView.as_view(), name='user-detail-update-delete'),
    path('api/roles/', RolListAPIView.as_view(), name='rol-list'), # Si usas roles
]