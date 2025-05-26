
# backend/core/views.py
#from django.shortcuts import render # Puedes borrar esta línea si no la usas
from rest_framework import generics # Importamos las vistas genéricas de DRF
from rest_framework.permissions import IsAuthenticated, IsAdminUser,AllowAny
from .models import *
from .serializers import *

class ItemListAPIView(generics.ListAPIView):
    """
    Vista para listar todos los ítems.
    """
    queryset = Item.objects.all() # Obtiene todos los objetos del modelo Item
    serializer_class = ItemSerializer # Usa el ItemSerializer para formatear los datos

class ProductListCreateAPIView(generics.ListCreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer
    # Permisos:
    # GET (listar) puede ser para cualquiera (AllowAny)
    # POST (crear) debe ser para usuarios autenticados y que sean admin
    def get_permissions(self):
        if self.request.method == 'POST':
            # Puedes elegir 'IsAuthenticated' si solo quieres que se registren para crear.
            # O 'IsAdminUser' si solo los administradores pueden crear.
            # Por ahora, dejemos que solo los administradores puedan crear.
            self.permission_classes = [IsAdminUser] # <-- CAMBIO AQUÍ
        else:
            self.permission_classes = [AllowAny] # Cualquier usuario puede ver la lista
        return super(ProductListCreateAPIView, self).get_permissions()
    
class ProductRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'pk'
    # Permisos:
    # GET (detalle) puede ser para cualquiera (AllowAny)
    # PUT/PATCH (actualizar) y DELETE (eliminar) deben ser para usuarios autenticados y admin
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsAdminUser] # <-- CAMBIO AQUÍ
        else:
            self.permission_classes = [AllowAny] # Cualquier usuario puede ver el detalle
        return super(ProductRetrieveUpdateDestroyAPIView, self).get_permissions()

class MarcaListAPIView(generics.ListAPIView):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
    permission_classes = [AllowAny] # O IsAuthenticated si se requiere login para ver marcas

class TipoProductoListAPIView(generics.ListAPIView):
    queryset = TipoProducto.objects.all()
    serializer_class = TipoProductoSerializer
    permission_classes = [AllowAny] # O IsAuthenticated