import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { Productos as ProductosService } from '../../services/productos';

@Component({
  selector: 'app-productos',
  imports: [FormsModule, RouterLink],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {
  productos: any[] = [];
  categorias: any[] = [];
  cargando = true;
  mensaje = '';
  error = '';
  modoEdicion = false;
  productoSeleccionado: any = null;

  nuevoProducto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagen: '',
    category_id: null
  };

  constructor(
    private authService: Auth,
    private productosService: ProductosService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarDatos();
  }

  cargarDatos() {
    this.productosService.getCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error(err)
    });

    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  getToken() {
    return this.authService.getToken() || '';
  }

  agregarProducto() {
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.precio) {
      this.error = 'Nombre y precio son requeridos';
      return;
    }
    this.productosService.crearProducto(this.nuevoProducto, this.getToken()).subscribe({
      next: () => {
        this.mensaje = '✅ Producto agregado correctamente';
        this.error = '';
        this.limpiarFormulario();
        this.cargarDatos();
      },
      error: () => this.error = '❌ Error al agregar producto'
    });
  }

  editarProducto(producto: any) {
    this.modoEdicion = true;
    this.productoSeleccionado = producto;
    this.nuevoProducto = {
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock,
      imagen: producto.imagen || '',
      category_id: producto.category_id
    };
  }

  actualizarProducto() {
    if (!this.productoSeleccionado) return;
    this.productosService.actualizarProducto(
      this.productoSeleccionado.id,
      this.nuevoProducto,
      this.getToken()
    ).subscribe({
      next: () => {
        this.mensaje = '✅ Producto actualizado correctamente';
        this.error = '';
        this.limpiarFormulario();
        this.cargarDatos();
      },
      error: () => this.error = '❌ Error al actualizar producto'
    });
  }

  eliminarProducto(id: number) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    this.productosService.eliminarProducto(id, this.getToken()).subscribe({
      next: () => {
        this.mensaje = '✅ Producto eliminado';
        this.cargarDatos();
      },
      error: () => this.error = '❌ Error al eliminar producto'
    });
  }

  limpiarFormulario() {
    this.modoEdicion = false;
    this.productoSeleccionado = null;
    this.nuevoProducto = {
      nombre: '', descripcion: '', precio: 0,
      stock: 0, imagen: '', category_id: null
    };
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
