# backend/core/serializers.py
from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        # '__all__' incluye todos los campos del modelo.
        # También puedes listar campos específicos: fields = ['id', 'name', 'quantity']
        fields = '__all__'