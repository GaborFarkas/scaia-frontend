import { Component } from '@angular/core';


//this is the component, containing the metadata (selector) and the template (html),and the style
@Component({
  selector: 'app-root',   //this is a selector, in the index.html, it inserts the app.component.html in the <app-root> tag
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']

})

//this is the "class" component, responsible for the logic
export class AppComponent {
  user = "Name";

}





