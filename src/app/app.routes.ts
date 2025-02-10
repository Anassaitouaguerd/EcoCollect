import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { DashboardComponent } from './features/dashboard/dashbaord/dashboard.component';
import { collectorGuard } from './guards/collector.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', redirectTo: 'login' },
    { path: 'home', component: HomeComponent, canActivate: [publicGuard]  },
    { path: 'dashboard', component: DashboardComponent ,canActivate: [collectorGuard] },
];
