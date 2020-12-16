import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswdError, ForgotPasswdRequest, ForgotPasswdResponse } from 'src/app/models/forgotpasswd.model';
import AuthService from 'src/app/services/auth.service';

@Component({
    selector: 'app-reset-passwd',
    templateUrl: 'resetPasswd.component.html'
})
export class ResetPasswdComponent implements OnInit {
    public passwdForm: FormGroup;
    public errorMsg: string = "";
    public submitted: boolean = false;

    public minPwLength: number = 0;
    public maxPwLength: number = Infinity;

    @Input('email') email: string;
    @Input('vericode') vericode: string;
    @Input('mandatory') mandatory: boolean;

    @Output() modeChanged = new EventEmitter<string>();

    constructor(
        private authService: AuthService,
        private router: Router,
        private formBuilder: FormBuilder) {
            this.passwdForm = this.formBuilder.group({
                password: new FormControl('', [Validators.required]),
                confirm: new FormControl('', [Validators.required]),
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
     * Change to the login component, remove query string.
     */
    public changeMode(): void {
        this.router.navigate(['login']);
        this.modeChanged.emit('login');
    }

    /**
     * Attempt to reset password using the form's data.
     */
    public onSubmit(forgotPwData: ForgotPasswdRequest): void {
        this.submitted = true;
        this.errorMsg = '';

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
        if (resp.token) {
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
            case ForgotPasswdError.TOKEN:
                this.errorMsg = 'Invalid token. Please try again.';
                break;
            case ForgotPasswdError.SERVER:
                this.errorMsg = 'The server is down or encountered an unexpected error. Please try again later.';
                break;
        }
    }
}

const resetFormValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    if (control.value.password !== control.value.confirm) {
        return { passwordMustMatch: true };
    }

    return null;
}
