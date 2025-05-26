# backend/core/views.py

from rest_framework import generics, status, viewsets # Importamos viewsets también para consistencia
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from .models import *
from .serializers import *

from django.shortcuts import get_object_or_404
from django.db import transaction # <-- IMPORTANTE: Necesario para operaciones atómicas

class ItemListAPIView(generics.ListAPIView):
    """
    Vista para listar todos los ítems.
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class ProductListCreateAPIView(generics.ListCreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer
    # Permisos:
    # GET (listar) puede ser para cualquiera (AllowAny)
    # POST (crear) debe ser para usuarios autenticados y que sean admin
    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAdminUser]
        else:
            self.permission_classes = [AllowAny]
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
            self.permission_classes = [IsAdminUser]
        else:
            self.permission_classes = [AllowAny]
        return super(ProductRetrieveUpdateDestroyAPIView, self).get_permissions()

class MarcaListAPIView(generics.ListAPIView):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
    permission_classes = [AllowAny]

class TipoProductoListAPIView(generics.ListAPIView):
    queryset = TipoProducto.objects.all()
    serializer_class = TipoProductoSerializer
    permission_classes = [AllowAny]

class RolListAPIView(generics.ListAPIView):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer
    permission_classes = [AllowAny]

# Vista para el registro de nuevos usuarios
class RegisterUserView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = RegisterUserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()

# Vistas para el Mantenedor de Usuarios (solo para administradores)
class UserListCreateAPIView(generics.ListCreateAPIView):
    queryset = Usuario.objects.all().order_by('username')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UserRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'pk'
    permission_classes = [IsAdminUser]

# Vistas para DireccionUsuario
class DireccionUsuarioListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = DireccionUsuarioSerializer
    permission_classes = [IsAuthenticated] # <-- CORREGIDO: Permitir a usuarios autenticados

    def get_queryset(self):
        # Permite a los administradores ver todas las direcciones, usuarios solo las suyas
        if self.request.user.is_staff:
            return DireccionUsuario.objects.all()
        return DireccionUsuario.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class DireccionUsuarioRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DireccionUsuarioSerializer
    permission_classes = [IsAuthenticated] # <-- CORREGIDO: Permitir a usuarios autenticados
    lookup_field = 'pk'

    def get_queryset(self):
        # Permite a los administradores ver/gestionar cualquier dirección, usuarios solo las suyas
        if self.request.user.is_staff:
            return DireccionUsuario.objects.all()
        return DireccionUsuario.objects.filter(usuario=self.request.user)

    def perform_update(self, serializer):
        # Asegura que el usuario solo actualice sus propias direcciones o si es admin
        if serializer.instance.usuario != self.request.user and not self.request.user.is_staff:
            raise PermissionDenied("No tienes permiso para editar esta dirección.")
        serializer.save()

    def perform_destroy(self, instance):
        # Asegura que el usuario solo elimine sus propias direcciones o si es admin
        if instance.usuario != self.request.user and not self.request.user.is_staff:
            raise PermissionDenied("No tienes permiso para eliminar esta dirección.")
        instance.delete()


# Vistas para EstadoPedido
class EstadoPedidoListCreateAPIView(generics.ListCreateAPIView):
    queryset = EstadoPedido.objects.all()
    serializer_class = EstadoPedidoSerializer
    # La lista de estados puede ser útil para usuarios normales (ej. en filtros),
    # pero la creación/edición debe ser solo para admin.
    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAdminUser]
        else:
            self.permission_classes = [IsAuthenticated] # Usuarios autenticados pueden listar estados
        return super(EstadoPedidoListCreateAPIView, self).get_permissions()

class EstadoPedidoRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = EstadoPedido.objects.all()
    serializer_class = EstadoPedidoSerializer
    permission_classes = [IsAdminUser]

# Vistas para MetodoPago
class MetodoPagoListCreateAPIView(generics.ListCreateAPIView):
    queryset = MetodoPago.objects.all()
    serializer_class = MetodoPagoSerializer
    # Los métodos de pago deben ser visibles para cualquier usuario autenticado para el checkout
    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [IsAdminUser]
        else:
            self.permission_classes = [IsAuthenticated] # <-- CORREGIDO: Usuarios autenticados pueden listar métodos de pago
        return super(MetodoPagoListCreateAPIView, self).get_permissions()

class MetodoPagoRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MetodoPago.objects.all()
    serializer_class = MetodoPagoSerializer
    permission_classes = [IsAdminUser]


# Vistas para el Carrito de Compras (que es un Pedido en estado 'Pendiente')
class CarritoView(APIView):
    permission_classes = [IsAuthenticated]

    def get_carrito(self, user):
        pendiente_estado = get_object_or_404(EstadoPedido, estado='Pendiente')
        carrito, created = Pedido.objects.get_or_create(
            usuario=user,
            estado=pendiente_estado,
            defaults={'alias': 'Carrito de Compras'}
        )
        return carrito

    def get(self, request, *args, **kwargs):
        carrito = self.get_carrito(request.user)
        serializer = PedidoSerializer(carrito)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        producto_id = request.data.get('producto_id')
        cantidad = request.data.get('cantidad', 1)

        if not producto_id or not isinstance(cantidad, int) or cantidad <= 0:
            return Response({"error": "ID de producto y cantidad válidos son requeridos."},
                            status=status.HTTP_400_BAD_REQUEST)

        producto = get_object_or_404(Producto, id=producto_id)
        carrito = self.get_carrito(request.user)

        with transaction.atomic(): # Asegura que la operación es atómica
            # Verificar stock antes de añadir/actualizar
            if producto.cantidad_disponible < cantidad: # Esto es para el primer intento de añadir
                return Response({"error": f"No hay suficiente stock de {producto.nombre}. Disponible: {producto.cantidad_disponible}"},
                                status=status.HTTP_400_BAD_REQUEST)

            detalle, created = DetallePedido.objects.get_or_create(
                pedido=carrito,
                producto=producto,
                defaults={
                    'cantidad': cantidad,
                    'precio_unitario': producto.precio
                }
            )
            if not created:
                # Si el detalle ya existía, verifica si la nueva cantidad supera el stock
                nueva_cantidad_total = detalle.cantidad + cantidad
                if producto.cantidad_disponible < cantidad: # Si no hay suficiente para añadir la nueva cantidad
                    return Response({"error": f"No hay suficiente stock de {producto.nombre} para añadir más. Disponible: {producto.cantidad_disponible}"},
                                    status=status.HTTP_400_BAD_REQUEST)
                detalle.cantidad = nueva_cantidad_total
            
            # Ajustar stock del producto *después* de la verificación de cantidad
            producto.cantidad_disponible -= cantidad
            producto.save() # Guarda el stock actualizado
            detalle.save() # <-- Asegurado dentro del bloque atómico

        serializer = PedidoSerializer(carrito)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        detalle_id = request.data.get('detalle_id')
        nueva_cantidad = request.data.get('cantidad')

        if not detalle_id or not isinstance(nueva_cantidad, int) or nueva_cantidad < 0:
            return Response({"error": "ID de detalle y cantidad válidos son requeridos."},
                            status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic(): # Asegura que la operación es atómica
            detalle = get_object_or_404(DetallePedido, id=detalle_id, pedido=self.get_carrito(request.user))
            producto = detalle.producto
            
            # Calcular la diferencia de cantidad para ajustar el stock
            diferencia_cantidad = nueva_cantidad - detalle.cantidad

            if diferencia_cantidad > 0: # Si se está aumentando la cantidad
                if producto.cantidad_disponible < diferencia_cantidad:
                    return Response({"error": f"No hay suficiente stock de {producto.nombre} para aumentar a {nueva_cantidad}. Disponible: {producto.cantidad_disponible}"},
                                    status=status.HTTP_400_BAD_REQUEST)
            
            # Ajustar stock
            producto.cantidad_disponible -= diferencia_cantidad
            producto.save()

            detalle.cantidad = nueva_cantidad
            
            if detalle.cantidad == 0:
                detalle.delete() # Si la cantidad llega a 0, elimina el detalle
            else:
                detalle.save() # <-- Asegurado dentro del bloque atómico

        serializer = PedidoSerializer(self.get_carrito(request.user))
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        detalle_id = request.data.get('detalle_id')
        vaciar_carrito = request.data.get('vaciar_carrito', False)

        carrito = self.get_carrito(request.user)

        with transaction.atomic(): # Asegura que la operación es atómica
            if vaciar_carrito:
                # Devuelve el stock de todos los productos al vaciar el carrito
                for detalle in carrito.detallepedido_set.all(): # <-- CORREGIDO: Usar detallepedido_set
                    producto = detalle.producto
                    producto.cantidad_disponible += detalle.cantidad
                    producto.save()
                carrito.detallepedido_set.all().delete() # <-- CORREGIDO: Usar detallepedido_set
            elif detalle_id:
                detalle = get_object_or_404(DetallePedido, id=detalle_id, pedido=carrito)
                # Devuelve el stock del producto eliminado
                producto = detalle.producto
                producto.cantidad_disponible += detalle.cantidad
                producto.save()
                detalle.delete()
            else:
                return Response({"error": "Se debe especificar un 'detalle_id' o 'vaciar_carrito' como true."},
                                status=status.HTTP_400_BAD_REQUEST)

        serializer = PedidoSerializer(carrito)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Vista para realizar el Checkout (convertir el carrito en una venta)
class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        direccion_id = request.data.get('direccion_id')
        metodo_pago_id = request.data.get('metodo_pago_id')

        if not direccion_id or not metodo_pago_id:
            return Response({"error": "Dirección de entrega y método de pago son requeridos."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Usar get_object_or_404 por si el carrito no existe en estado pendiente para el usuario
        pendiente_estado = get_object_or_404(EstadoPedido, estado='Pendiente')
        carrito = get_object_or_404(
            Pedido,
            usuario=request.user,
            estado=pendiente_estado
        )

        if not carrito.detallepedido_set.exists(): # <-- CORREGIDO: Usar detallepedido_set
            return Response({"error": "El carrito está vacío. No se puede realizar el checkout."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Asegurarse de que la dirección pertenece al usuario o es admin si aplica
        direccion_entrega = get_object_or_404(DireccionUsuario, id=direccion_id, usuario=request.user)
        metodo_pago = get_object_or_404(MetodoPago, id=metodo_pago_id)

        with transaction.atomic():
            # 1. Actualizar el estado del Pedido (carrito)
            confirmado_estado = get_object_or_404(EstadoPedido, estado='Confirmado')
            carrito.estado = confirmado_estado
            carrito.direccion_entrega = direccion_entrega
            carrito.save()

            # 2. Crear la Venta asociada a este Pedido
            monto_total_venta = sum(item.cantidad * item.precio_unitario for item in carrito.detallepedido_set.all()) # <-- CORREGIDO: Usar detallepedido_set
            Venta.objects.create(
                pedido=carrito,
                metodo_pago=metodo_pago,
                monto=monto_total_venta
            )
            # Opcional: Crear la Entrega aquí o en un proceso separado
            # ...

        serializer = PedidoSerializer(carrito)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Vistas CRUD para Pedidos (para usuarios, historial de compras, y para admin)
class PedidoListAPIView(generics.ListAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Asegúrate que el estado 'Pendiente' exista
        pendiente_estado = get_object_or_404(EstadoPedido, estado='Pendiente')
        # Administradores ven todos los pedidos (excepto carritos pendientes)
        if self.request.user.is_staff:
            return Pedido.objects.all().exclude(estado=pendiente_estado).order_by('-fecha_pedido')
        # Usuarios normales ven solo sus propios pedidos confirmados (excepto carritos pendientes)
        return Pedido.objects.filter(usuario=self.request.user).exclude(estado=pendiente_estado).order_by('-fecha_pedido')

class PedidoRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = PedidoSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        if self.request.user.is_staff:
            return Pedido.objects.all()
        return Pedido.objects.filter(usuario=self.request.user)

# Vistas CRUD para Venta (principalmente para admin)
class VentaListCreateAPIView(generics.ListCreateAPIView):
    queryset = Venta.objects.all().order_by('-fecha_transaccion')
    serializer_class = VentaSerializer
    permission_classes = [IsAdminUser]

class VentaRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer
    lookup_field = 'pk'
    permission_classes = [IsAdminUser]

# Serializers y Vistas para Contact, HistorialPrecios, EstadoEntrega, Entrega
# Si tienes más vistas de este tipo, irían aquí...

# Vistas para Contact
class ContactListCreateAPIView(generics.ListCreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Contact.objects.all()
        return Contact.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        # Asigna el usuario actual al crear el contacto
        serializer.save(usuario=self.request.user)

class ContactRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    lookup_field = 'pk'

    def get_permissions(self):
        # GET (ver) puede ser para el usuario dueño o admin
        # PUT/PATCH (responder/actualizar) solo para admin
        # DELETE solo para admin (o dueño si se le permite borrar su consulta)
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsAdminUser]
        else: # GET
            # Permite al usuario ver su propio contacto
            self.permission_classes = [IsAuthenticated]
        return super(ContactRetrieveUpdateDestroyAPIView, self).get_permissions()

    def get_queryset(self):
        # Permite al usuario ver solo sus propios contactos
        if self.request.user.is_staff:
            return Contact.objects.all()
        return Contact.objects.filter(usuario=self.request.user)

# Vistas para HistorialPrecios (solo lectura, generalmente para admin o info detallada de producto)
class HistorialPreciosListAPIView(generics.ListAPIView):
    queryset = HistorialPrecios.objects.all()
    serializer_class = HistorialPreciosSerializer
    permission_classes = [IsAdminUser] # Solo admins pueden ver el historial de precios

class HistorialPreciosRetrieveAPIView(generics.RetrieveAPIView):
    queryset = HistorialPrecios.objects.all()
    serializer_class = HistorialPreciosSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'pk'


# Vistas para EstadoEntrega
class EstadoEntregaListCreateAPIView(generics.ListCreateAPIView):
    queryset = EstadoEntrega.objects.all()
    serializer_class = EstadoEntregaSerializer
    permission_classes = [IsAdminUser] # Solo admin puede crear/listar

class EstadoEntregaRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = EstadoEntrega.objects.all()
    serializer_class = EstadoEntregaSerializer
    permission_classes = [IsAdminUser] # Solo admin puede editar/eliminar

# Vistas para Entrega (CRUD para admin, lectura para usuario)
class EntregaListCreateAPIView(generics.ListCreateAPIView):
    queryset = Entrega.objects.all().order_by('-fecha_entrega')
    serializer_class = EntregaSerializer
    permission_classes = [IsAdminUser]

class EntregaRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entrega.objects.all()
    serializer_class = EntregaSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'pk'