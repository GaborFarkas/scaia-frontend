import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SignupError, SignupResponse, SingupRequest } from 'src/app/models/signup.model';
import AuthService from 'src/app/services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css']
})
export class RegisterComponent implements OnInit {
    public signupForm: FormGroup;
    public registrationDisabled: boolean = false;
    public errorMsg: string = "";
    public submitted: boolean = false;

    public minUserLength: number = 0;
    public maxUserLength: number = Infinity;
    public minPwLength: number = 0;
    public maxPwLength: number = Infinity;

    public userNameExists: boolean = false;
    public invalidEmail: boolean = false;
    public userNameNotEmail: boolean = false;

    @Output() modeChanged = new EventEmitter<string>();

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder) {
            this.createSignupForm({});
        }

    public ngOnInit(): void {
        //Use the signup service to get form variables.
        this.authService.getSignupForm().subscribe(data => {
            this.minUserLength = data.minUserLength;
            this.maxUserLength = data.maxUserLength;
            this.minPwLength = data.minPwLength;
            this.maxPwLength = data.maxPwLength;

            this.createSignupForm(data);
        },
        err => {
            this.handleError(SignupError.SERVER);
        });
    }

    /**
     * Change to the login component.
     */
    public changeMode(): void {
        this.modeChanged.emit('login');
    }

    /**
     * Attempt to sign up using the form's data.
     */
    public onSubmit(signupData: SingupRequest): void {
        this.submitted = true;
        this.userNameExists = false;
        this.invalidEmail = false;
        this.userNameNotEmail = false;
        this.errorMsg = '';

        if (this.signupForm.valid) {
            this.authService.signup(signupData).subscribe(data => {
                this.handleResponse(data);
            },
            err => {
                this.handleError(SignupError.SERVER);
            })
        } else {
            console.log(this.signupForm);
        }
    }

    /**
     * Creates the signup FormGroup with the required validators.
     * @param formData
     */
    private createSignupForm(formData: SignupResponse): void {
        this.registrationDisabled = formData.registrationDisabled ?? false;
        if (this.registrationDisabled) {
            this.errorMsg = 'Registration is currently disabled. Please try again later.';
        }

        this.signupForm = this.formBuilder.group({
            username: new FormControl('', [Validators.required, Validators.minLength(formData.minUserLength), Validators.maxLength(formData.maxUserLength)]),
            fname: new FormControl('', [Validators.required]),
            lname: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required, Validators.minLength(formData.minPwLength), Validators.maxLength(formData.maxPwLength)]),
            confirm: new FormControl('', [Validators.required]),
            csrf: new FormControl(formData.token)
        }, {validators: signupFormValidator});
    }

    /**
     * Handles the response of the server's login endpoint
     * @param resp 
     */
    private handleResponse(resp: SignupResponse): void {
        if (resp.error) {
            this.handleError(resp.error);
        } else if (resp.registrationDisabled) {
            this.registrationDisabled = true;
            this.errorMsg = 'Registration is currently disabled. Please try again later.';
        } else {
            //Navigate back to the login page if the signup was successful.
            this.modeChanged.emit('login');
        }
    }

    /**
     * Sets the error message according to the error type.
     * @param err 
     */
    private handleError(err: SignupError): void {
        switch (err) {
            case SignupError.INPUT:
                this.errorMsg = 'One or more of the input fields are invalid.';
                break;
            case SignupError.RECAPTCHA:
                this.errorMsg = 'Automated signup attempt detected. Please try again.';
                break;
            case SignupError.TOKEN:
                this.errorMsg = 'Invalid token. Please try again.';
                break;
            case SignupError.SERVER:
                this.errorMsg = 'The server is down or encountered an unexpected error. Please try again later.';
                break;
            case SignupError.USERNAME:
                this.userNameExists = true;
                break;
            case SignupError.EMAIL:
                this.invalidEmail = true;
                break;
            case SignupError.NOTEMAIL:
                this.userNameNotEmail = true;
                break;
        }
    }
}

const signupFormValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    if (control.value.password !== control.value.confirm) {
        return { passwordMustMatch: true };
    }

    return null;
}