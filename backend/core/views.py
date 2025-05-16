
# backend/core/views.py
#from django.shortcuts import render # Puedes borrar esta línea si no la usas
from rest_framework import generics # Importamos las vistas genéricas de DRF
from .models import Item
from .serializers import ItemSerializer

class ItemListAPIView(generics.ListAPIView):
    """
    Vista para listar todos los ítems.
    """
    queryset = Item.objects.all() # Obtiene todos los objetos del modelo Item
    serializer_class = ItemSerializer # Usa el ItemSerializer para formatear los datos