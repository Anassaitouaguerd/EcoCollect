import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', redirectTo: 'login' },
    { path: 'home', component: HomeComponent },
];
