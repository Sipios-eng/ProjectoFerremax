# backend/core/serializers.py
from rest_framework import serializers
from .models import *

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        # '__all__' incluye todos los campos del modelo.
        # También puedes listar campos específicos: fields = ['id', 'name', 'quantity']
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        # '__all__' incluye todos los campos del modelo.
        # También puedes listar campos específicos: fields = ['id', 'name', 'quantity']
        fields = '__all__'

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ['id', 'nombre']

class TipoProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoProducto
        fields = ['id', 'nombre']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añadir campos personalizados al token (ej. is_staff, que es is_admin en el frontend)
        token['username'] = user.username
        token['is_admin'] = user.is_staff # <-- Aquí añadimos si es staff/admin

        return token
