import { Component, ViewEncapsulation, OnInit, Input, ViewChild } from '@angular/core';
import AuthService from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserData } from 'src/app/models/userdata.model';
import ConfigService from 'src/app/services/config.service';
import { NavbarComponent } from 'src/app/components/navbar';
import { MapComponent } from 'src/app/components/map';
import { ThrowStmt } from '@angular/compiler';
import { AddNewJobComponent } from 'src/app/components/addNewJob';
import { HelpComponent } from 'src/app/components/help';

@Component({
    templateUrl: 'home.page.html',
    styleUrls: ['./home.page.css'],
    encapsulation: ViewEncapsulation.None
})
export class HomePage implements OnInit {
    public userData: UserData;
    public mode: string = '';

    private navigateId: string = '';

    @ViewChild('map') map: MapComponent;
    @ViewChild('help') help: HelpComponent;
    @ViewChild('addNewJob') addNewJob: AddNewJobComponent;

    constructor(
        private authService: AuthService,
        private configService: ConfigService,
        private router: Router) { }

    ngOnInit() {
        this.authService.getLoginForm().subscribe(data => {
            if (!data || data.banned || !data.userData || !data.userData.emailVerified) {
                // User is banned, needs email verification, or the server is down, go back to the login page.
                this.router.navigate(["login"]);
            } else {
                this.userData = data.userData;

                // Request static configs at this point so they will be cached when used.
                this.configService.getProductsAsync();
                this.configService.getMapsAsync();
                this.configService.getStylesAsync();
                this.configService.getBaseStyleAsync();
                this.configService.getHelpAsync();
            }
        },
            err => {
                this.router.navigate(["login"]);
            });
    }

    /**
     * Open a control, or close it if it is clicked again.
     * @param newMode
     */
    public changeMode(newMode: string) {
        if (this.mode === newMode) {
            this.mode = "";
        } else {
            this.mode = newMode;
        }

        // Clear navigateId so we do not invoke a Product-based component with an incorrect position.
        this.navigateId = '';
    }

    /**
     * Logs out the current user from the application and redirects to the login page.
     */
    public logout(): void {
        this.authService.logout().subscribe(() => {
            this.router.navigate(["login"]);
        });
    }

    /**
     * Closes the current window.
     */
    public close(): void {
        this.mode = "";
    }

    /**
     * Adds a product map (set of layers) to the map.
     * @param mapId
     */
    public showMap(mapId: string): void {
        this.map.addMap(mapId);
    }

    /**
     * Navigates back to the addNewJob component if help was invoked from there.
     */
    public onHelpBack(): void {
        if (this.navigateId) {
            this.mode = 'addNewJob'
        }
    }

    /**
     * Navigates to the help page of a process.
     */
    public onHelp(id: string): void {
        this.navigateId = id;
        this.mode = 'help';
    }
}
