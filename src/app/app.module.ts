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
import { ContactComponent } from './components/contact';
import { HelpComponent } from './components/help';
import { TutorialComponent } from './components/tutorial';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from './components/map';


@NgModule({
  declarations: [     //array, which contains all the components, used by the app
    AppComponent,
    HomePage,
    LoginPage,
    LoginComponent,
    RegisterComponent,
    AddNewJobComponent,
    JobQueryComponent,
    DataDownloadComponent,
    ContactComponent,
    HelpComponent,
    TutorialComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
