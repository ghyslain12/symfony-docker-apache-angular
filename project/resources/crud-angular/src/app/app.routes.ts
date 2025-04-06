import { Routes } from '@angular/router';
import {LoginComponent} from './features/login/login.component';
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', loadChildren: () => import('./features/home/home.routes').then(m => m.homeRoutes), canActivate: [authGuard] },
  { path: 'sale', loadChildren: () => import('./features/provisioning/provisioning.routes').then(m => m.provisioningRoutes), canActivate: [authGuard] },
  { path: 'ticket', loadChildren: () => import('./features/ticketing/ticketing.routes').then(m => m.ticketingRoutes), canActivate: [authGuard] },
  { path: 'user', loadChildren: () => import('./features/users/users.routes').then(m => m.usersRoutes), canActivate: [authGuard] },
  { path: 'client', loadChildren: () => import('./features/users/clients.routes').then(m => m.clientsRoutes), canActivate: [authGuard] },
  { path: 'material', loadChildren: () => import('./features/materials/materials.routes').then(m => m.materialsRoutes), canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

