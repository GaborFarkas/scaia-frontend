import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginError, LoginRequest, LoginResponse } from 'src/app/models/login.model';
import LoginService from 'src/app/services/login.service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
    public errorMsg: string = "";
    public loginForm: FormGroup;
    @Output() modeChanged = new EventEmitter<string>();

    constructor(
        private loginService: LoginService,
        private formBuilder: FormBuilder,
        private router: Router) {
            this.loginForm = this.formBuilder.group({
                username: '',
                password: '',
                csrf: ''
            });
        }

    public ngOnInit() {
        //Use the login service to check if there is a logged-in user.
        this.loginService.getData().subscribe(data => {
            this.handleResponse(data);
        });
    }

    /**
     * Change to the registration component.
     */
    public changeMode(): void {
        this.modeChanged.emit('register');
    }

    /**
     * Attempt to log in using the form's data.
     */
    public onSubmit(loginData: LoginRequest): void {
        if (loginData.username && loginData.password) {
            //Proceed to login.
            this.loginService.login(loginData).subscribe(data => {
                this.handleResponse(data);
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
        console.log(resp);
        if (resp.token) {
            //If we get a token from the server, no user is logged in. Use the token in the login form.
            this.loginForm.patchValue({
                csrf: resp.token
            });
        } else if (resp.banned) {
            this.errorMsg = 'This user was banned from using the application. For further information please contact the administrators.';
        } else if (resp.error) {
            this.handleError(resp.error);
        } else if (resp.userData) {
            //Navigate back to the home page if a logged-in user is detected.
            this.router.navigate(['']);
        }
    }

    /**
     * Sets the error message according to the error type.
     * @param err 
     */
    private handleError(err: LoginError) {
        switch (err) {
            case LoginError.INPUT:
                this.errorMsg = 'Username or password is invalid';
                break;
            case LoginError.RECAPTCHA:
                this.errorMsg = 'Automated login attempt detected. Please try again.';
                break;
            case LoginError.TOKEN:
                this.errorMsg = 'Invalid token. Please tr again.';
                break;
        }
    }
}
