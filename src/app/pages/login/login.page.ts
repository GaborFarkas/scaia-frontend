import { Component, ViewEncapsulation } from '@angular/core';
import { LoginError } from 'src/app/models/login.model';

@Component({
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css'],
    encapsulation: ViewEncapsulation.None
})
export class LoginPage {
    public mode: string = "login";
    public error: LoginError = LoginError.NONE;

    /**
     * Indicates whether we need to notify the user about a special case.
     */
    public get needUserAttention(): boolean {
        return this.error === LoginError.BANNED || this.error === LoginError.VERIFY;
    }

    /**
     * Returns an error message based on the current error.
     */
    public get errorMsg(): string {
        switch (this.error) {
            case LoginError.BANNED:
                return 'Your account has been suspended indefinitely. For further information, please contact us at xx@yy.zz';
            case LoginError.VERIFY:
                return 'Please verify your email address before starting to use the application.';
            default:
                return '';
        }
    }

    public onModeChanged(newMode: string) {
        this.mode = newMode;
    }

    public onError(error: LoginError) {
        this.error = error;
    }
}
