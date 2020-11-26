import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SignupResponse, SingupRequest } from 'src/app/models/signup.model';
import AuthService from 'src/app/services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
    public signupForm: FormGroup;
    @Output() modeChanged = new EventEmitter<string>();

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder) {
            this.createForm({});
        }

    public ngOnInit(): void {
        //Use the signup service to get form variables.
        this.authService.getSignupForm().subscribe(data => {
            this.createForm(data);
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
        console.log(signupData);
    }

    /**
     * Creates the signup FormGroup with the required validators.
     * @param formData
     */
    private createForm(formData: SignupResponse): void {
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
}

const signupFormValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    if (control.get('password') !== control.get('confirm')) {
        return { passwordMustMatch: true};
    }

    return null;
}