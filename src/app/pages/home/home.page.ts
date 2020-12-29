import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import AuthService from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserData } from 'src/app/models/userdata.model';
import ConfigService from 'src/app/services/config.service';
import { NavbarComponent } from 'src/app/components/navbar';

@Component({
  templateUrl: 'home.page.html' ,
  styleUrls: [ './home.page.css' ],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements OnInit {
  public userData: UserData;
  public mode: string = "";

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private router: Router) {}

  ngOnInit() {
    this.authService.getLoginForm().subscribe(data => {
      if (!data || data.banned || !data.userData || !data.userData.emailVerified) {
        // User is banned, needs email verification, or the server is down, go back to the login page.
        this.router.navigate(["login"]);
      } else {
        this.userData = data.userData;

        // Request the product config at this point so it will be cached when used.
        this.configService.getProductsAsync();
      }
    },
    err => {
      this.router.navigate(["login"]);
    });
  }

  public changeMode(newMode: string ) {
    if(this.mode === newMode) {
      this.mode = "";
    } else {
      this.mode = newMode;
    }
  }

  /**
   * Logs out the current user from the application and redirects to the login page.
   */
  public logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(["login"]);
    });
  }

}
