import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { LoginComponent } from './components/login';
import { RegisterComponent } from './components/register';


@NgModule({
  declarations: [     //array, which contains all the components, used by the app
    AppComponent,
    HomePage,
    LoginPage,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
