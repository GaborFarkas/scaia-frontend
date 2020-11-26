import { Component, EventEmitter, NgModule, Output, ViewChild, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  templateUrl: 'home.page.html' ,
  styleUrls: [ './home.page.css' ],
  encapsulation: ViewEncapsulation.None
})
export class HomePage {

  @ViewChild('main_field', { static: true }) field: ElementRef;
  public toggleVisibility: boolean = false; //if "false", field is visible

  hideToggle() {

    if(this.toggleVisibility == true){
      this.field.nativeElement.style="display:none";
      this.toggleVisibility = ! this.toggleVisibility;

    }else{
      this.field.nativeElement.style="display:block";
      this.toggleVisibility = ! this.toggleVisibility;
    }
  }



  public mode: string = "";
  @Output() modeChanged = new EventEmitter<string>();


  public changeMode(newMode: string ) {
    this.mode = newMode;
}

}
