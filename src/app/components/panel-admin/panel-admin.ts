import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Auth, Usuario } from '../../services/auth';

@Component({
  selector: 'app-panel-admin',
  imports: [FormsModule, RouterLink],
  templateUrl: './panel-admin.html',
  styleUrl: './panel-admin.css'
})
export class PanelAdmin implements OnInit {
  usuario: Usuario | null = null;
  usuarios: any[] = [];
  pedidos: any[] = [];
  cargando = true;
  tabActiva = 'pedidos';

  constructor(private authService: Auth, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.usuario = this.authService.getUsuario();
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarPedidos();
    this.cargarUsuarios();
  }

  getHeaders() {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
  }

  cargarPedidos() {
    this.http.get<any[]>('http://localhost:3003/pedidos', { headers: this.getHeaders() }).subscribe({
      next: (data) => { this.pedidos = data; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  cargarUsuarios() {
    this.http.get<any[]>('http://localhost:3002/usuarios', { headers: this.getHeaders() }).subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error(err)
    });
  }

  actualizarEstatus(pedido: any) {
    this.http.patch(`http://localhost:3003/pedidos/${pedido.id}/estatus`,
      { estatus: pedido.estatus, numero_guia: pedido.numero_guia || null },
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => alert(`✅ Pedido #${pedido.id} actualizado`),
      error: () => alert('❌ Error al actualizar')
    });
  }

  cambiarRol(usuario: any) {
    this.http.patch(`http://localhost:3002/usuarios/${usuario.id}/rol`,
      { role_id: parseInt(usuario.role_id) },
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => alert(`✅ Rol actualizado`),
      error: () => alert('❌ Error al cambiar rol')
    });
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }

  getBadgeClass(estatus: string): string {
    const clases: any = {
      'pendiente': 'is-warning', 'pagado': 'is-info',
      'en preparacion': 'is-link', 'enviado': 'is-primary',
      'entregado': 'is-success', 'cancelado': 'is-danger'
    };
    return clases[estatus] || 'is-light';
  }
}
