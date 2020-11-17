import { Component, EventEmitter, NgModule, Output, ViewEncapsulation } from '@angular/core';

@Component({
  templateUrl: 'home.page.html' ,
  styleUrls: [ './home.page.css' ],
  encapsulation: ViewEncapsulation.None
})
export class HomePage {
  public mode: string = "";
  @Output() modeChanged = new EventEmitter<string>();

  public changeMode(newMode: string) {
    this.mode = newMode;
}
}
