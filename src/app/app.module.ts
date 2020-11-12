import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserinputComponent } from './components/userinput/userinput.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [     //array, which contains all the components, used by the app
    AppComponent,
    UserinputComponent,
    LoginComponent
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
