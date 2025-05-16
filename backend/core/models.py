# backend/core/models.py

from django.db import models
# Importamos settings para referenciar el modelo de usuario de Django de forma segura
from django.conf import settings
from django.contrib.auth.models import AbstractUser

# Modelo de Rol
class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre

# Modelo de Usuario extendido
class Usuario(AbstractUser):
    telefono = models.CharField(max_length=20, blank=True, null=True)
    rut = models.CharField(max_length=20, blank=True, null=True)
    rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, blank=True)

# Dirección asociada a un usuario
class DireccionUsuario(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    direccion = models.CharField(max_length=255)
    ciudad = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    codigo_postal = models.CharField(max_length=20)

# Tipo de Producto
class TipoProducto(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

# Marca
class Marca(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

# Producto
class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=3)
    impuesto_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    descuento_porcentaje = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    cantidad_disponible = models.IntegerField()
    imagen_url = models.URLField(max_length=200)
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE)
    tipo_producto = models.ForeignKey(TipoProducto, on_delete=models.CASCADE)

# Estado del pedido
class EstadoPedido(models.Model):
    estado = models.CharField(max_length=20)

    def __str__(self):
        return self.estado

# Pedido
class Pedido(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    alias = models.CharField(max_length=70, blank=True, null=True)
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    estado = models.ForeignKey(EstadoPedido, on_delete=models.SET_NULL, null=True)
    cantidad_producto = models.IntegerField(null=True, blank=True)
    precio_producto = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    direccion_entrega = models.ForeignKey('DireccionUsuario', on_delete=models.SET_NULL, null=True)

# Detalle del pedido
class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

# Método de pago
class MetodoPago(models.Model):
    metodo = models.CharField(max_length=100)

# Venta
class Venta(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    metodo_pago = models.ForeignKey(MetodoPago, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_transaccion = models.DateTimeField(auto_now_add=True)

# Estado de entrega
class EstadoEntrega(models.Model):
    estado = models.CharField(max_length=30)

# Entrega
class Entrega(models.Model):
    pedido = models.OneToOneField(Pedido, on_delete=models.CASCADE)
    fecha_entrega = models.DateTimeField()
    estado_entrega = models.ForeignKey(EstadoEntrega, on_delete=models.SET_NULL, null=True)

# Contacto o consulta
class Contact(models.Model):
    motivo = models.CharField(max_length=100)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    comentario = models.CharField(max_length=100)
    respuesta = models.CharField(max_length=100, null=True, blank=True)

# Historial de precios
class HistorialPrecios(models.Model):
    producto = models.ForeignKey(Producto, related_name='historial_precios', on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)

class Item(models.Model):
    name = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name