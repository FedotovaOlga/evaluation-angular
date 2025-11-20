import { Routes } from '@angular/router';
import { FormationsComponent } from './components/formations/formations';
import { HomeComponent } from './components/home/home';
import { AuthComponent } from './components/auth/auth';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'formations', component: FormationsComponent, canActivate: [authGuard] },
  { path: 'auth', component: AuthComponent },
];
