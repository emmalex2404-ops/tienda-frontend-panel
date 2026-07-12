import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  correo = '';
  password = '';
  error = '';
  cargando = false;

  constructor(private authService: Auth, private router: Router) {}

  login() {
    if (!this.correo || !this.password) {
      this.error = 'Todos los campos son requeridos';
      return;
    }
    this.cargando = true;
    this.error = '';
    this.authService.login({ correo: this.correo, password: this.password }).subscribe({
      next: (res) => {
        this.authService.guardarSesion(res.token, res.usuario);
        if (res.usuario.rol === 'administrador' || res.usuario.rol === 'vendedor') {
          this.router.navigate(['/panel-admin']);
        } else {
          this.router.navigate(['/panel-cliente']);
        }
      },
      error: () => {
        this.error = 'Correo o contraseña incorrectos';
        this.cargando = false;
      }
    });
  }
}
