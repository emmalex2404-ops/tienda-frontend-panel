import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { PanelCliente } from './components/panel-cliente/panel-cliente';
import { PanelAdmin } from './components/panel-admin/panel-admin';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'panel-cliente', component: PanelCliente },
  { path: 'panel-admin', component: PanelAdmin },
  { path: 'dashboard', component: Dashboard },
];
