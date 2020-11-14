import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css'],
    encapsulation: ViewEncapsulation.None
})
export class LoginPage {
    public mode: string = "login";

    public onModeChanged(newMode: string) {
        this.mode = newMode;
    }
}
