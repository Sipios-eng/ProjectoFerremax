# backend/core/urls.py
from django.urls import path
from .views import * # Importa tu vista de API

urlpatterns = [
    # Define la ruta para tu API de ítems
    # La URL será /api/items/ (combinada con el prefijo en el urls.py principal)
    path('items/', ItemListAPIView.as_view(), name='item-list'),
    path('producto/', ProductListCreateAPIView.as_view(), name='product-list'),
    path('producto/<int:pk>/', ProductRetrieveUpdateDestroyAPIView.as_view(), name='product-detail-update-delete'),
    path('marcas/', MarcaListAPIView.as_view(), name='marca-list'),        # NUEVA RUTA
    path('tipos-producto/', TipoProductoListAPIView.as_view(), name='tipo-producto-list'), # NUEVA RUTA
]