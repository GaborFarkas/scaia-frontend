import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginError, LoginRequest, LoginResponse } from 'src/app/models/login.model';
import AuthService from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
    public errorMsg: string = "";
    public loginForm: FormGroup;
    @Output() modeChanged = new EventEmitter<string>();
    @Output() error = new EventEmitter<LoginError>();

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router) {
            this.loginForm = this.formBuilder.group({
                username: '',
                password: '',
                csrf: ''
            });
        }

    public ngOnInit(): void {
        //Use the login service to check if there is a logged-in user.
        this.authService.getLoginForm().subscribe(data => {
            this.handleResponse(data);
        });
    }

    /**
     * Change to the registration component.
     */
    public changeMode(mode: string): void {
        this.modeChanged.emit(mode);
    }

    /**
     * Attempt to log in using the form's data.
     */
    public onSubmit(loginData: LoginRequest): void {
        this.errorMsg = '';
        if (loginData.username && loginData.password) {
            //Proceed to login.
            this.authService.login(loginData).subscribe(data => {
                this.handleResponse(data);
            },
            err => {
                this.handleError(LoginError.SERVER);
            });
        } else {
            this.errorMsg = 'Please fill both the username and the password fields.';
        }
    }

    /**
     * Handles the response of the server's login endpoint
     * @param resp
     */
    private handleResponse(resp: LoginResponse): void {
        if (resp.token) {
            //If we get a token from the server, no user is logged in. Use the token in the login form.
            this.loginForm.patchValue({
                csrf: resp.token
            });
        } else if (resp.banned) {
            //Emit error if the user was banned to show a special screen.
            this.error.emit(LoginError.BANNED);
        } else if (resp.error) {
            this.handleError(resp.error);
        } else if (resp.userData && !resp.userData.emailVerified) {
            //Emit error if the user needs to verify their email address to show a special screen.
            this.error.emit(LoginError.VERIFY);
        } else if (resp.userData) {
            //Navigate back to the home page if a logged-in user is detected.
            this.router.navigate(['']);
        }
    }

    /**
     * Sets the error message according to the error type.
     * @param err
     */
    private handleError(err: LoginError): void {
        switch (err) {
            case LoginError.INPUT:
                this.errorMsg = 'Username or password is invalid';
                break;
            case LoginError.RECAPTCHA:
                this.errorMsg = 'Automated login attempt detected. Please try again.';
                break;
            case LoginError.TOKEN:
                this.errorMsg = 'Invalid token. Please try again.';
                break;
            case LoginError.SERVER:
                this.errorMsg = 'The server is down or encountered an unexpected error. Please try again later.';
                break;
        }
    }
}
