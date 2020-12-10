import { Component, ViewEncapsulation } from '@angular/core';
import { LoginError } from 'src/app/models/login.model';
import AuthService from 'src/app/services/auth.service';

@Component({
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css'],
    encapsulation: ViewEncapsulation.None
})
export class LoginPage {
    public mode: string = "login";
    public error: LoginError = LoginError.NONE;

    constructor(
        private authService: AuthService) {}

    /**
     * Indicates whether we need to notify the user about a special case.
     */
    public get needUserAttention(): boolean {
        return this.error === LoginError.BANNED || this.error === LoginError.VERIFY;
    }

    /**
     * Indicates whether the user needs to verify their email.
     */
    public get needToVerify(): boolean {
        return this.error === LoginError.VERIFY;
    }

    /**
     * Returns an error message based on the current error.
     */
    public get errorMsg(): string {
        switch (this.error) {
            case LoginError.BANNED:
                return 'Your account has been suspended indefinitely. For further information, please contact us at xx@yy.zz';
            case LoginError.VERIFY:
                return 'Please verify your email address before using the application.';
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

    /**
     * Resend the verification email.
     */
    public onResend(): void {
        this.authService.verifyResend().subscribe();
    }
}
