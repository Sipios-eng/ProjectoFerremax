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

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

# Nuevo Serializer para Usuario
class UserSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.CharField(source='rol.nombre', read_only=True) # Para mostrar el nombre del rol

    class Meta:
        model = Usuario
        # Incluye todos los campos que quieres serializar
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'telefono', 'rut', 'rol', 'rol_nombre', 'is_staff', 'is_active', 'date_joined')
        read_only_fields = ('is_staff', 'is_active', 'date_joined', 'rol_nombre') # Campos que no se editan directamente por el usuario (admin si puede is_staff)

    # Este método es crucial para la creación de usuarios, especialmente para encriptar la contraseña
    def create(self, validated_data):
        # Extrae la contraseña antes de crear el usuario, porque AbstractUser.create_user la encripta
        password = validated_data.pop('password', None)
        user = Usuario.objects.create(**validated_data)
        if password is not None:
            user.set_password(password) # Encripta la contraseña
        user.save()
        return user

    # Este método es para actualizar usuarios
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password is not None:
            user.set_password(password)
            user.save()
        return user

# Serializer para el registro (solo para crear un usuario, sin campos de administración)
class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = Usuario
        # Los campos que el usuario registrará
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name', 'telefono', 'rut')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2') # Eliminar password2, ya no lo necesitamos
        user = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            telefono=validated_data.get('telefono', ''),
            rut=validated_data.get('rut', '')
        )
        # Aquí puedes asignar un rol por defecto si es necesario, ej:
        # default_rol = Rol.objects.get(nombre='Cliente') # Asume que tienes un rol 'Cliente'
        # user.rol = default_rol
        user.save()
        return user


# (Tu MyTokenObtainPairSerializer existente, si está en el mismo archivo)
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['is_admin'] = user.is_staff
        token['is_active'] = user.is_active # Podría ser útil
        # Si quieres el rol, también lo puedes agregar:
        # if user.rol:
        #     token['rol'] = user.rol.nombre

        return token
