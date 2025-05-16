# backend/core/admin.py
from django.contrib import admin
from .models import (Item, Rol, Usuario, DireccionUsuario, TipoProducto, Marca,
    Producto, EstadoPedido, Pedido, DetallePedido, MetodoPago,
    Venta, EstadoEntrega, Entrega, Contact, HistorialPrecios)

admin.site.register(Rol)

from django.contrib.auth.admin import UserAdmin

class CustomUsuarioAdmin(UserAdmin):
    # Define qué campos mostrar en la lista (list_display)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'rol', 'telefono', 'rut')
    # Define qué campos son enlaces a la página de detalle (list_display_links)
    list_display_links = ('username', 'email')
    # Define qué campos se pueden editar directamente en la lista (list_editable) - úsalo con cuidado
    # list_editable = ('is_staff', 'is_active', 'rol') # Ejemplo
    # Define campos por los que se puede filtrar (list_filter)
    list_filter = ('is_staff', 'is_active', 'rol')
    # Define campos por los que se puede buscar (search_fields)
    search_fields = ('username', 'email', 'first_name', 'last_name', 'rut', 'telefono')
    # Define los campos a mostrar en la página de añadir/editar usuario (fieldsets)
    # Esto es más complejo, UserAdmin define muchos campos por defecto.
    # Asegúrate de incluir tus campos personalizados aquí o extendiendo los fieldsets de UserAdmin.
    # Por ahora, si no defines fieldsets, Django intentará mostrar todos los campos,
    # pero es posible que necesites definir fieldsets para un control total.
    # Ejemplo básico (puede necesitar ajuste según lo que quieras mostrar):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('telefono', 'rut', 'rol')}),
    )
    # Define los campos a mostrar en la página de añadir usuario (add_fieldsets)
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('telefono', 'rut', 'rol')}),
    )

admin.site.register(Usuario, CustomUsuarioAdmin)

admin.site.register(DireccionUsuario)
admin.site.register(TipoProducto)
admin.site.register(Marca)
admin.site.register(Producto)
admin.site.register(EstadoPedido)
admin.site.register(Pedido)
admin.site.register(DetallePedido)
admin.site.register(MetodoPago)
admin.site.register(Venta)
admin.site.register(EstadoEntrega)
admin.site.register(Entrega)
admin.site.register(Contact)
admin.site.register(HistorialPrecios)
admin.site.register(Item)