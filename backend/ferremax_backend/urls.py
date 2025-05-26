# backend/ferremax_project/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from rest_framework_simplejwt.views import TokenObtainPairView # Importa la vista base para pasar serializer
from core.serializers import MyTokenObtainPairSerializer # Importa tu serializer personalizado
from core.views import *
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
    path('api/roles/', RolListAPIView.as_view(), name='rol-list'), 

    # Rutas para Direcciones de Usuario
    path('api/direcciones/', DireccionUsuarioListCreateAPIView.as_view(), name='direccion-list-create'),
    path('api/direcciones/<int:pk>/', DireccionUsuarioRetrieveUpdateDestroyAPIView.as_view(), name='direccion-detail-update-delete'),

    # Rutas para el Carrito (Pedido en estado 'Pendiente')
    path('api/carrito/', CarritoView.as_view(), name='carrito'),
    path('api/checkout/', CheckoutView.as_view(), name='checkout'),

    # Rutas para Gestión de Pedidos (historial de compras para usuarios, CRUD para admin)
    path('api/pedidos/', PedidoListAPIView.as_view(), name='pedido-list'),
    path('api/pedidos/<int:pk>/', PedidoRetrieveAPIView.as_view(), name='pedido-detail'),

    # Rutas para Gestión de Ventas (solo para administradores)
    path('api/ventas/', VentaListCreateAPIView.as_view(), name='venta-list-create'),
    path('api/ventas/<int:pk>/', VentaRetrieveUpdateDestroyAPIView.as_view(), name='venta-detail-update-delete'),

    # Rutas para estados y métodos de pago (para admin, para llenar selectores)
    path('api/estado-pedidos/', EstadoPedidoListCreateAPIView.as_view(), name='estado-pedido-list-create'),
    path('api/estado-pedidos/<int:pk>/', EstadoPedidoRetrieveUpdateDestroyAPIView.as_view(), name='estado-pedido-detail-update-delete'),
    path('api/metodos-pago/', MetodoPagoListCreateAPIView.as_view(), name='metodo-pago-list-create'),
    path('api/metodos-pago/<int:pk>/', MetodoPagoRetrieveUpdateDestroyAPIView.as_view(), name='metodo-pago-detail-update-delete'),
]