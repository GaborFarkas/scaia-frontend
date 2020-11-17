import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';

const routes: Routes = [
 {path: '', component: HomePage},
 {path: 'login', component: LoginPage },

 {path: '**', redirectTo: ''}

];
export const AppRoutingModule = RouterModule.forRoot(routes);
