# backend/core/urls.py
from django.urls import path
from .views import ItemListAPIView # Importa tu vista de API

urlpatterns = [
    # Define la ruta para tu API de ítems
    # La URL será /api/items/ (combinada con el prefijo en el urls.py principal)
    path('items/', ItemListAPIView.as_view(), name='item-list'),
]