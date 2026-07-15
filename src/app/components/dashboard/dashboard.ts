import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Auth, Usuario } from '../../services/auth';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  @ViewChild('chartEstatus') chartEstatusRef!: ElementRef;
  @ViewChild('chartPedidos') chartPedidosRef!: ElementRef;

  usuario: Usuario | null = null;
  pedidos: any[] = [];
  totalPedidos = 0;
  totalPagados = 0;
  totalPendientes = 0;
  totalEntregados = 0;
  cargando = true;

  constructor(
    private authService: Auth,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usuario = this.authService.getUsuario();
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarDatos();
  }

  getHeaders() {
    return new HttpHeaders({ Authorization: `Bearer ${this.authService.getToken()}` });
  }

  cargarDatos() {
    this.http.get<any[]>('http://localhost:3003/pedidos', { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.pedidos = data;
        this.totalPedidos = data.length;
        this.totalPagados = data.filter(p => p.estatus === 'pagado').length;
        this.totalPendientes = data.filter(p => p.estatus === 'pendiente').length;
        this.totalEntregados = data.filter(p => p.estatus === 'entregado').length;
        this.cargando = false;
        this.cdr.detectChanges();
        setTimeout(() => this.generarGraficas(), 300);
      },
      error: (err) => {
        console.error('Error:', err);
        this.cargando = false;
      }
    });
  }

  generarGraficas() {
    if (!this.chartEstatusRef || !this.chartPedidosRef) {
      console.error('Canvas no encontrado');
      return;
    }

    new Chart(this.chartEstatusRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Pendiente', 'Pagado', 'En preparación', 'Enviado', 'Entregado', 'Cancelado'],
        datasets: [{
          data: [
            this.pedidos.filter(p => p.estatus === 'pendiente').length,
            this.pedidos.filter(p => p.estatus === 'pagado').length,
            this.pedidos.filter(p => p.estatus === 'en preparacion').length,
            this.pedidos.filter(p => p.estatus === 'enviado').length,
            this.pedidos.filter(p => p.estatus === 'entregado').length,
            this.pedidos.filter(p => p.estatus === 'cancelado').length,
          ],
          backgroundColor: ['#f59e0b','#3b82f6','#8b5cf6','#06b6d4','#10b981','#ef4444'],
        }]
      },
      options: { responsive: false, plugins: { legend: { position: 'bottom' } } }
    });

    const totalesPorPedido = this.pedidos.slice(0, 10).map(p => parseFloat(p.total));
    const labelsPedidos = this.pedidos.slice(0, 10).map(p => `#${p.id}`);

    new Chart(this.chartPedidosRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labelsPedidos,
        datasets: [{
          label: 'Total por pedido (MXN)',
          data: totalesPorPedido,
          backgroundColor: '#3b82f6',
          borderRadius: 6,
        }]
      },
      options: {
        responsive: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
