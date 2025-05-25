
# backend/core/views.py
#from django.shortcuts import render # Puedes borrar esta línea si no la usas
from rest_framework import generics # Importamos las vistas genéricas de DRF
from .models import *
from .serializers import *

class ItemListAPIView(generics.ListAPIView):
    """
    Vista para listar todos los ítems.
    """
    queryset = Item.objects.all() # Obtiene todos los objetos del modelo Item
    serializer_class = ItemSerializer # Usa el ItemSerializer para formatear los datos

class ProductListCreateAPIView(generics.ListCreateAPIView):
    """
    Vista para listar todos los items.
    """
    queryset = Producto.objects.all() # Obtiene todos los objetos del modelo Item
    serializer_class = ProductSerializer# Usa el ItemSerializer para formatear los datos