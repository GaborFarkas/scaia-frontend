import { Component, Output, EventEmitter, Input } from '@angular/core';
import { UserData } from 'src/app/models/userdata.model';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() userData: UserData;
  @Input() mode: string;

  @Output() navMode = new EventEmitter<string>();
  @Output() logOut = new EventEmitter();

  public get userName(): string {
    return this.userData ? this.userData.fname + " " + this.userData.lname : '';
  }

  public navChangeMode(newNavMode: string){
    this.navMode.emit(newNavMode);
  }

  public onLogOut() {
    this.logOut.emit();
  }
}
