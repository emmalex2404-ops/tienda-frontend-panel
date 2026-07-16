import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Auth, Usuario } from '../../services/auth';

@Component({
  selector: 'app-panel-cliente',
  imports: [DatePipe],
  templateUrl: './panel-cliente.html',
  styleUrl: './panel-cliente.css'
})
export class PanelCliente implements OnInit {
  usuario: Usuario | null = null;
  pedidos: any[] = [];
  cargando = true;

  constructor(private authService: Auth, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.usuario = this.authService.getUsuario();
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarPedidos();
  }

  cargarPedidos() {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
    this.http.get<any[]>('https://api-pedidos.hexamx.com.mx/pedidos/mis-pedidos', { headers }).subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }

  getBadgeClass(estatus: string): string {
    const clases: any = {
      'pendiente': 'is-warning',
      'pagado': 'is-info',
      'en preparacion': 'is-link',
      'enviado': 'is-primary',
      'entregado': 'is-success',
      'cancelado': 'is-danger'
    };
    return clases[estatus] || 'is-light';
  }
}
