import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

//import { LoginComponent } from './components/login/login.component';
import { UserinputComponent } from './components/userinput/userinput.component';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';


const routes: Routes = [
 {path: '', component: HomeComponent},
 {path: 'login', component: LoginComponent },
 {path: 'register', component: RegisterComponent},

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
