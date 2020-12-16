import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginError } from 'src/app/models/login.model';
import AuthService from 'src/app/services/auth.service';

@Component({
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css'],
    encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit {
    public mode: string = "login";
    public error: LoginError = LoginError.NONE;
    public sending: boolean = false;

    public email: string = "";
    public vericode: string = "";
    public forceReset: boolean = false;

    @ViewChild('verifyBtn') verifyBtn: HTMLButtonElement;

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router) {}

    ngOnInit(): void {
        // If we have a valid-looking password reset URL, parse the input from the query string. Else, remove it.
        this.route.queryParams.subscribe(p => {
            if (p && p.email && p.vericode && p.reset == 1) {
                this.email = p.email;
                this.vericode = p.vericode;
                this.mode = 'resetpasswd';
            } else {
                this.router.navigate(['login']);
            }
        });
    }

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
                return 'Your account has been suspended indefinitely. For further information, please contact us at gfarkas@gamma.ttk.pte.hu';
            case LoginError.VERIFY:
                return 'Please verify your email address before using the application.';
            default:
                return '';
        }
    }

    public onModeChanged(newMode: string) {
        // If the reset mode is initiated by the login component, it is mandatory.
        if (newMode === "resetpasswd") {
            this.forceReset = true;
        }

        this.mode = newMode;
    }

    public onError(error: LoginError) {
        this.error = error;
    }

    /**
     * Resend the verification email.
     */
    public onResend(): void {
        if (!this.sending) {
            this.sending = true;
            this.verifyBtn.disabled = true;
            this.authService.verifyResend().subscribe(() => {
                this.verifyBtn.textContent = 'E-mail sent';
            },
            err => {
                this.verifyBtn.disabled = false;
                this.sending = false;
            });
        }
    }
}
