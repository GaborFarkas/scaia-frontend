import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { AlertComponent } from './components/alert';
import AlertService from './services/alert.service';


//this is the component, containing the metadata (selector) and the template (html),and the style
@Component({
  selector: 'app-root',   //this is a selector, in the index.html, it inserts the app.component.html in the <app-root> tag
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  encapsulation: ViewEncapsulation.None
})

//this is the "class" component, responsible for the logic
export class AppComponent implements AfterViewInit {
  public logoExpanded = false;
  @ViewChild('alertComp') alertComp: AlertComponent;

  constructor(private alertService: AlertService) {}

  ngAfterViewInit(): void {
    this.alertService.register(this.alertComp);
  }

  public toggleLogo() {
    this.logoExpanded = !this.logoExpanded;
  }
}
