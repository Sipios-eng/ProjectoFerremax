#backend/ferremax_backend/urls.py
"""
URL configuration for ferremax_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# backend/ferremax_backend/urls.py
# backend/ferremax_backend/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    # TokenObtainPairView, # NO importes TokenObtainPairView directamente de rest_framework_simplejwt.views si vas a usar un serializer personalizado
    TokenRefreshView,
    TokenVerifyView,
)
from rest_framework_simplejwt.views import TokenObtainPairView # <-- Importa la vista base para poder pasarle el serializer
from core.serializers import MyTokenObtainPairSerializer # <-- YA LO TENEMOS IMPORTADO

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),

    # Rutas para JWT Authentication
    # ¡CAMBIA ESTA LÍNEA!
    path('api/token/', TokenObtainPairView.as_view(serializer_class=MyTokenObtainPairSerializer), name='token_obtain_pair'), # <-- ASÍ DEBE SER
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
