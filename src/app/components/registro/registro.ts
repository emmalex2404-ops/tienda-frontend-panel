import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  nombre = '';
  correo = '';
  password = '';
  error = '';
  exito = '';
  cargando = false;

  constructor(private authService: Auth, private router: Router) {}

  registrar() {
    if (!this.nombre || !this.correo || !this.password) {
      this.error = 'Todos los campos son requeridos';
      return;
    }
    this.cargando = true;
    this.error = '';
    this.authService.registro({ nombre: this.nombre, correo: this.correo, password: this.password }).subscribe({
      next: () => {
        this.exito = 'Cuenta creada correctamente. Redirigiendo...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al registrar usuario';
        this.cargando = false;
      }
    });
  }
}
