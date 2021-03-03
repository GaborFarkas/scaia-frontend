import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { LoginComponent } from './components/login';
import { RegisterComponent } from './components/register';
import { AddNewJobComponent } from './components/addNewJob';
import { JobQueryComponent } from './components/jobQuery';
import { DataDownloadComponent } from './components/dataDownload';
import { HelpComponent } from './components/help';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from './components/map';
import { UserSettingsComponent } from './components/userSettings';
import { ForgotPasswdComponent } from './components/forgotPasswd';
import { ResetPasswdComponent } from './components/resetPasswd';
import { NavbarComponent } from './components/navbar';
import { AlertComponent } from './components/alert';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

@NgModule({
  declarations: [     //array, which contains all the components, used by the app
    AppComponent,
    HomePage,
    LoginPage,
    LoginComponent,
    RegisterComponent,
    ForgotPasswdComponent,
    ResetPasswdComponent,
    AddNewJobComponent,
    JobQueryComponent,
    DataDownloadComponent,
    HelpComponent,
    NavbarComponent,
    MapComponent,
    UserSettingsComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
