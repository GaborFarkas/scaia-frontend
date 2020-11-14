import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';


const routes: Routes = [
 {path: '', component: HomePage},
 {path: 'login', component: LoginPage },

 {path: '**', redirectTo: ''}

];

/*
@NgModule({
  imports: [RouterModule.forRoot(routes)],  //the "roots" array, initialized above, is passed to the forRoot() function, as attribute
  exports: [RouterModule]
})
export class AppRoutingModule { }
*/
export const AppRoutingModule = RouterModule.forRoot(routes);
