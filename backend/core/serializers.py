# backend/core/serializers.py
from rest_framework import serializers
from .models import (
    Item, Producto, Marca, TipoProducto,
    Rol, Usuario, DireccionUsuario, EstadoPedido, MetodoPago,
    Pedido, DetallePedido, Venta, EstadoEntrega, Entrega,
    Contact, HistorialPrecios # Importa todos los modelos que estás usando
)

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# NOTA: Tu modelo de usuario personalizado se llama 'Usuario'.
# Es una buena práctica obtenerlo con get_user_model() cuando se trabaja con usuarios
# para evitar problemas de dependencia circular o si el modelo de usuario cambia.
# from django.contrib.auth import get_user_model
# User = get_user_model() # Esto te daría tu modelo 'Usuario'

# Serializers existentes que no se modifican (excepto los necesarios para el flujo)

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ['id', 'nombre']

class TipoProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoProducto
        fields = ['id', 'nombre']

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

# Serializer para Usuario
class UserSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.CharField(source='rol.nombre', read_only=True)

    class Meta:
        model = Usuario # Usamos tu modelo Usuario directamente
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'telefono', 'rut', 'rol', 'rol_nombre', 'is_staff', 'is_active', 'date_joined')
        read_only_fields = ('is_staff', 'is_active', 'date_joined', 'rol_nombre')

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Usuario.objects.create(**validated_data)
        if password is not None:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password is not None:
            user.set_password(password)
            user.save()
        return user

# Serializer para el registro
class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = Usuario # Usamos tu modelo Usuario directamente
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name', 'telefono', 'rut')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            telefono=validated_data.get('telefono', ''),
            rut=validated_data.get('rut', '')
        )
        user.save()
        return user

# Token Serializer (como lo tenías, con tu Usuario)
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_admin'] = user.is_staff
        token['is_active'] = user.is_active
        if hasattr(user, 'rol') and user.rol: # Aseguramos que el usuario tenga un rol antes de intentar acceder a él
            token['rol'] = user.rol.nombre
        return token

# Serializer para DireccionUsuario
class DireccionUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = DireccionUsuario
        fields = '__all__'
        read_only_fields = ('usuario',)

# Serializer para EstadoPedido
class EstadoPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoPedido
        fields = '__all__'

# Serializer para MetodoPago
class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodoPago
        fields = '__all__'

# Serializer para DetallePedido
class DetallePedidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    producto_imagen_url = serializers.URLField(source='producto.imagen_url', read_only=True) # <--- AÑADE ESTO
    # 'producto_precio_unitario_actual' es redundante si 'precio_unitario' ya es el precio al momento de la venta
    # Lo he dejado comentado, usa 'precio_unitario' que es el precio registrado en el detalle
    # producto_precio_unitario_actual = serializers.DecimalField(source='producto.precio', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = DetallePedido
        fields = ['id', 'producto', 'producto_nombre', 'producto_imagen_url', 'cantidad', 'precio_unitario']
        read_only_fields = ['precio_unitario'] # El precio unitario se toma del producto al añadir/actualizar

# Serializer para Pedido (incluye sus DetallePedido anidados)
class PedidoSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    estado_nombre = serializers.CharField(source='estado.estado', read_only=True)
    direccion_entrega_detalle = DireccionUsuarioSerializer(source='direccion_entrega', read_only=True)
    # **CORRECCIÓN CLAVE AQUÍ: Usamos 'detallepedido_set' por el related_name por defecto**
    detalles = DetallePedidoSerializer(many=True, read_only=True, source='detallepedido_set')

    # Campos calculados para el total del pedido/carrito
    total_cantidad = serializers.SerializerMethodField()
    total_monto = serializers.SerializerMethodField()

    class Meta:
        model = Pedido
        fields = [
            'id', 'usuario', 'usuario_username', 'alias', 'fecha_pedido',
            'estado', 'estado_nombre', 'direccion_entrega', 'direccion_entrega_detalle',
            'detalles', 'total_cantidad', 'total_monto'
        ]
        read_only_fields = ('usuario', 'fecha_pedido', 'estado', 'total_cantidad', 'total_monto')

    def get_total_cantidad(self, obj):
        # **CORRECCIÓN CLAVE AQUÍ: Usamos 'detallepedido_set'**
        return sum(item.cantidad for item in obj.detallepedido_set.all())

    def get_total_monto(self, obj):
        # **CORRECCIÓN CLAVE AQUÍ: Usamos 'detallepedido_set'**
        return sum(item.cantidad * item.precio_unitario for item in obj.detallepedido_set.all())

    def create(self, validated_data):
        return Pedido.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.alias = validated_data.get('alias', instance.alias)
        instance.direccion_entrega = validated_data.get('direccion_entrega', instance.direccion_entrega)
        instance.save()
        return instance

# Serializer para Venta
class VentaSerializer(serializers.ModelSerializer):
    # Asegúrate de que 'pedido_id' sea un nombre que tenga sentido con el frontend.
    # Si el frontend espera el ID directo, PrimaryKeyRelatedField está bien.
    # Cambia esta línea:
    # pedido_id = serializers.PrimaryKeyRelatedField(source='pedido', queryset=Pedido.objects.all())
    # A esta, para asegurar que se envía el ID numérico:
    pedido_id = serializers.IntegerField(source='pedido.id', read_only=True) # <-- ESTA ES LA MODIFICACIÓN
    metodo_pago_nombre = serializers.CharField(source='metodo_pago.metodo', read_only=True)
    usuario_username = serializers.CharField(source='pedido.usuario.username', read_only=True)
    detalle_pedido_set = DetallePedidoSerializer(source='pedido.detallepedido_set', many=True, read_only=True)
    # También podemos añadir el estado del pedido asociado a la venta
    pedido_estado = serializers.CharField(source='pedido.estado.estado', read_only=True)

    class Meta:
        model = Venta
        fields = '__all__' # Asegúrate de que pedido_id esté incluido si usas fields = ['id', ...]


# Serializer para EstadoEntrega
class EstadoEntregaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoEntrega
        fields = '__all__'

# Serializer para Entrega
class EntregaSerializer(serializers.ModelSerializer):
    pedido_id = serializers.PrimaryKeyRelatedField(source='pedido', queryset=Pedido.objects.all())
    estado_entrega_nombre = serializers.CharField(source='estado_entrega.estado', read_only=True)

    class Meta:
        model = Entrega
        fields = ['id', 'pedido_id', 'fecha_entrega', 'estado_entrega', 'estado_entrega_nombre']

# Serializer para Contact
class ContactSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)

    class Meta:
        model = Contact
        fields = ['id', 'motivo', 'producto', 'producto_nombre', 'usuario', 'usuario_username', 'comentario', 'respuesta']
        read_only_fields = ['usuario', 'producto']

# Serializer para HistorialPrecios
class HistorialPreciosSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialPrecios
        fields = '__all__'

class ProductoMinSerializer(serializers.ModelSerializer):
    # Un serializer mínimo para DetallePedido, si no quieres todos los campos del producto
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'precio'] # Incluye solo los campos necesarios