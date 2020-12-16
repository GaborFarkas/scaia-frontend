import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPasswdError, ResetPasswdRequest, ResetPasswdResponse } from 'src/app/models/resetPasswd.model';
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
        //Remove query string, we already processed it.
        this.router.navigate(['login']);
        //Use the login service to check if there is a logged-in user.
        this.authService.getResetPasswd().subscribe(data => {
            this.minPwLength = data.minPwLength;
            this.maxPwLength = data.maxPwLength;

            this.createResetForm(data);
        },
        err => {
            this.handleError(ResetPasswdError.SERVER);
        });

        if (this.mandatory) {
            this.errorMsg = "The system requires you to change your password. Sorry for the inconvenience.";
        }
    }

    /**
     * Change to the login component.
     */
    public changeMode(): void {
        this.modeChanged.emit('login');
    }

    /**
     * Attempt to reset password using the form's data.
     */
    public onSubmit(resetPwData: ResetPasswdRequest): void {
        this.submitted = true;
        this.errorMsg = '';

        if (this.passwdForm.valid) {
            this.authService.postResetPasswd(resetPwData, this.email, this.vericode).subscribe(data => {
                this.handleResponse(data);
            },
            err => {
                this.handleError(ResetPasswdError.SERVER);
            });
        }
    }

    /**
     * Creates the reset password FormGroup with the required validators.
     * @param formData
     */
    private createResetForm(formData: ResetPasswdResponse): void {
        this.passwdForm = this.formBuilder.group({
            password: new FormControl('', [Validators.required, Validators.minLength(formData.minPwLength), Validators.maxLength(formData.maxPwLength)]),
            confirm: new FormControl('', [Validators.required]),
            csrf: new FormControl(formData.token)
        }, {validators: resetFormValidator});
    }

    /**
     * Handles the response of the server's forgot passwd endpoint
     * @param resp 
     */
    private handleResponse(resp: ResetPasswdResponse): void {
        if (!resp) {
            //Reset was successful. Go back to the login page.
            this.modeChanged.emit('login');
        } else if (resp.error) {
            this.handleError(resp.error);
        }
    }

    /**
     * Sets the error message according to the error type.
     * @param err 
     */
    private handleError(err: ResetPasswdError): void {
        switch (err) {
            case ResetPasswdError.INPUT:
                this.errorMsg = 'One or more of the input fields are invalid.';
                break;
            case ResetPasswdError.TOKEN:
                this.errorMsg = 'Invalid token. Please try again.';
                break;
            case ResetPasswdError.EXPIRED:
                this.errorMsg = 'The reset link has been expired. Please request a new one.';
                break;
            case ResetPasswdError.SERVER:
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
