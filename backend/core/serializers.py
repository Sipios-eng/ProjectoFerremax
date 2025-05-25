# backend/core/serializers.py
from rest_framework import serializers
from .models import *

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