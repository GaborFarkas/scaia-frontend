import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import LoginService from 'src/app/services/login.service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
    public token: string = "";
    @Output() modeChanged = new EventEmitter<string>();

    constructor(
        private loginService: LoginService,
        private router: Router) { }

    public ngOnInit() {
        //Use the login service to check if there is a logged-in user.
        this.loginService.getData().subscribe(data => {
            if (data.token) {
                //If we get a token from the server, no user is logged in. Use the token in the login form.
                this.token = data.token;
            } else {
                //Navigate back to the home page if a logged-in user is detected.
                this.router.navigate(['']);
            }
        });
    }

    public changeMode() {
        this.modeChanged.emit('register');
    }
}
