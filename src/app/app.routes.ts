import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { CricketComponent } from './pages/cricket/cricket';
import { Top10 } from './pages/top10/top10';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'cricket', component: CricketComponent, canActivate: [authGuard] },
  { path: 'top10', component: Top10, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];