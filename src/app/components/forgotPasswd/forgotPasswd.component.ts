import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswdError, ForgotPasswdRequest, ForgotPasswdResponse } from 'src/app/models/forgotpasswd.model';
import AuthService from 'src/app/services/auth.service';

@Component({
    selector: 'app-forgot-passwd',
    templateUrl: 'forgotPasswd.component.html',
    styleUrls: ['forgotPasswd.component.css']
})
export class ForgotPasswdComponent implements OnInit {
    public passwdForm: FormGroup;
    public errorMsg: string = "";
    public confirmMsg: string = "";
    public submitted: boolean = false;

    @Output() modeChanged = new EventEmitter<string>();

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder) {
            this.passwdForm = this.formBuilder.group({
                email: new FormControl('', [Validators.required]),
                csrf: new FormControl('')
            });
        }

    public ngOnInit(): void {
        //Use the login service to check if there is a logged-in user.
        this.authService.getForgotPasswd().subscribe(data => {
            this.handleResponse(data);
        });
    }

    /**
     * Change to the registration component.
     */
    public changeMode(): void {
        this.modeChanged.emit('login');
    }

    /**
     * Attempt to reset password using the form's data.
     */
    public onSubmit(forgotPwData: ForgotPasswdRequest): void {
        this.submitted = true;
        this.errorMsg = '';
        this.confirmMsg = '';

        this.authService.postForgotPasswd(forgotPwData).subscribe(data => {
            this.handleResponse(data);
        },
        err => {
            this.handleError(ForgotPasswdError.SERVER);
        });
    }

    /**
     * Handles the response of the server's forgot passwd endpoint
     * @param resp 
     */
    private handleResponse(resp: ForgotPasswdResponse): void {
        if (!resp) {
            //Response is null, email was sent out successfully.
            this.confirmMsg = 'E-mail was sent out successfully.';
        } else if (resp.token) {
            //If we get a token from the server, the form is loading. Use the token in the forgot passwd form.
            this.passwdForm.patchValue({
                csrf: resp.token
            });
        } else if (resp.error) {
            this.handleError(resp.error);
        }
    }

    /**
     * Sets the error message according to the error type.
     * @param err 
     */
    private handleError(err: ForgotPasswdError): void {
        switch (err) {
            case ForgotPasswdError.INPUT:
                this.passwdForm.setErrors({
                    invalidEmail: true
                });
                break;
            case ForgotPasswdError.TOKEN:
                this.errorMsg = 'Invalid token. Please try again.';
                break;
            case ForgotPasswdError.SERVER:
                this.errorMsg = 'The server is down or encountered an unexpected error. Please try again later.';
                break;
            case ForgotPasswdError.USER:
                this.passwdForm.setErrors({
                    emailNonExistent: true
                });
                break;
        }
    }
}
