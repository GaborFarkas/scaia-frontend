import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from 'src/app/models/userdata.model';
import { UserSettingsError, UserSettingsRequest, UserSettingsResponse } from 'src/app/models/usersettings.model';
import AuthService from 'src/app/services/auth.service';

@Component({
    selector: 'app-userSettings',
    templateUrl: './userSettings.component.html',
    styleUrls: ['./userSettings.component.css']
})
export class UserSettingsComponent implements OnInit {
    @Input() userSettings: UserData;

    public canChangeUn: boolean = false;
    public userSettingsForm: FormGroup;
    public errorMsg: string = "";
    public submitted: boolean = false;

    public minUserLength: number = 0;
    public maxUserLength: number = Infinity;
    public minPwLength: number = 0;
    public maxPwLength: number = Infinity;

    constructor(
        private authService: AuthService,
        private router: Router,
        private formBuilder: FormBuilder) {
        this.createSettingsForm({});
    }

    ngOnInit(): void {
        this.authService.userSettings().subscribe(data => {
            this.canChangeUn = data.canChangeUn;
            this.minUserLength = data.minUserLength;
            this.maxUserLength = data.maxUserLength;
            this.minPwLength = data.minPwLength;
            this.maxPwLength = data.maxPwLength;

            this.createSettingsForm(data);
        },
            err => {
                if (err.status === 401) {
                    this.router.navigate(["login"]);
                } else {
                    this.handleError(UserSettingsError.SERVER);
                }
            });
    }

    /**
     * Creates the signup FormGroup with the required validators.
     * @param formData
     */
    private createSettingsForm(formData: UserSettingsResponse): void {
        this.userSettingsForm = this.formBuilder.group({
            username: new FormControl(this.userSettings?.username, [Validators.required, Validators.minLength(formData.minUserLength), Validators.maxLength(formData.maxUserLength)]),
            fname: new FormControl(this.userSettings?.fname, [Validators.required]),
            lname: new FormControl(this.userSettings?.lname, [Validators.required]),
            password: new FormControl('', [Validators.minLength(formData.minPwLength), Validators.maxLength(formData.maxPwLength)]),
            confirm: new FormControl('', []),
            csrf: new FormControl(formData.token)
        }, { validators: changeSettingsFormValidator });
    }

    /**
     * Sets the error message according to the error type.
     * @param err
     */
    private handleError(err: UserSettingsError): void {
        switch (err) {
            case UserSettingsError.INPUT:
                this.errorMsg = 'One or more of the input fields are invalid.';
                break;
            case UserSettingsError.RECAPTCHA:
                this.errorMsg = 'Automated attempt detected. Please try again.';
                break;
            case UserSettingsError.TOKEN:
                this.errorMsg = 'Invalid token. Please try again.';
                break;
            case UserSettingsError.SERVER:
                this.errorMsg = 'The server is down or encountered an unexpected error. Please try again later.';
                break;
            case UserSettingsError.USERNAME:
                this.userSettingsForm.setErrors({
                    userNameExists: true
                });
                break;
            case UserSettingsError.NOTEMAIL:
                this.userSettingsForm.setErrors({
                    userNameNotEmail: true
                });
                break;
            case UserSettingsError.UNONLYONCE:
                this.userSettingsForm.setErrors({
                    userNameOnlyOne: true
                });
                break;
            case UserSettingsError.CANNOTCHANGEUN:
                this.userSettingsForm.setErrors({
                    userNameCannotChange: true
                });
                break;
        }
    }

    /**
     * Attempt to change the user's settings.
     */
    public onSubmit(settingsData: UserSettingsRequest): void {
        this.submitted = true;
        this.errorMsg = '';

        if (this.userSettingsForm.valid) {
            this.authService.changeUserSettings(settingsData).subscribe(data => {
                this.handleResponse(data);
            },
            err => {
                this.handleError(UserSettingsError.SERVER);
            });
        }
    }

    /**
     * Handles the response of the server's change user settings endpoint
     * @param resp
     */
    private handleResponse(resp: UserSettingsResponse): void {
        if (resp.error) {
            this.handleError(resp.error);
        } else {
            //Navigate back to the login page if the change was successful.
            this.router.navigate(["login"]);
        }
    }
}

const changeSettingsFormValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    if (control.value.password && control.value.password !== control.value.confirm) {
        return { passwordMustMatch: true };
    }

    return null;
}
