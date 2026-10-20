// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Cricket } from './pages/cricket/cricket';
import { Top10 } from './pages/top10/top10';
import { authGuard } from './guards/auth.guard'; // <--- Import the guard

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'home', component: Home, canActivate: [authGuard] },       // Protected
  { path: 'cricket', component: Cricket, canActivate: [authGuard] }, // Protected
  { path: 'top10', component: Top10, canActivate: [authGuard] },     // Protected
  { path: '**', redirectTo: '' }
];