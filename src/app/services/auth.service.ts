import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/login.model';
import { modelToFormData } from '../utils/form.util';
import { SignupResponse, SingupRequest } from '../models/signup.model';
import { ForgotPasswdRequest, ForgotPasswdResponse } from '../models/forgotpasswd.model';
import { ResetPasswdRequest, ResetPasswdResponse } from '../models/resetPasswd.model';
import { GlobalConstants } from 'src/global';
import { UserSettingsRequest, UserSettingsResponse } from '../models/usersettings.model';

@Injectable({ providedIn: 'root' })
export default class AuthService {
    private baseUrl: string = GlobalConstants.baseUrl;

    constructor(private http: HttpClient) { }

    getLoginForm(): Observable<LoginResponse> {
        const loginUrl: string = this.baseUrl + '/login';
        return this.http.get<LoginResponse>(loginUrl);
    }

    login(loginData: LoginRequest): Observable<LoginResponse> {
        const loginUrl: string = this.baseUrl + '/login';
        return this.http.post<LoginResponse>(loginUrl, modelToFormData(loginData));
    }

    logout(): Observable<any> {
        const logoutUrl: string = this.baseUrl + '/logout';
        return this.http.get(logoutUrl);
    }

    getSignupForm(): Observable<SignupResponse> {
        const signupUrl: string = this.baseUrl + '/join';
        return this.http.get<SignupResponse>(signupUrl);
    }

    signup(signupData: SingupRequest) : Observable<SignupResponse> {
        const signupUrl: string = this.baseUrl + '/join';
        return this.http.post<SignupResponse>(signupUrl, modelToFormData(signupData));
    }

    getForgotPasswd() : Observable<ForgotPasswdResponse> {
        const forgotPwUrl: string = this.baseUrl + '/forgot_password';
        return this.http.get<ForgotPasswdResponse>(forgotPwUrl);
    }

    postForgotPasswd(forgotPwData: ForgotPasswdRequest) : Observable<ForgotPasswdResponse> {
        const forgotPwUrl: string = this.baseUrl + '/forgot_password';
        return this.http.post<ForgotPasswdResponse>(forgotPwUrl, modelToFormData(forgotPwData));
    }

    verifyResend() : Observable<null> {
        const verifyUrl: string = this.baseUrl + '/verify_resend';
        return this.http.get<null>(verifyUrl);
    }

    getResetPasswd() : Observable<ResetPasswdResponse> {
        const resetPwUrl: string = this.baseUrl + '/forgot_password_reset';
        return this.http.get<ResetPasswdResponse>(resetPwUrl);
    }

    postResetPasswd(resetPwData: ResetPasswdRequest, email: string, vericode: string) : Observable<ResetPasswdResponse> {
        const resetPwUrl: string = this.baseUrl + '/forgot_password_reset';
        const formData: FormData = modelToFormData(resetPwData);
        if (email) {
            formData.append('email', email);
        }
        if (vericode) {
            formData.append('vericode', vericode);
        }

        return this.http.post<ResetPasswdResponse>(resetPwUrl, formData);
    }

    userSettings() : Observable<UserSettingsResponse> {
        const usUrl: string = this.baseUrl + '/user_settings';
        return this.http.get<UserSettingsResponse>(usUrl);
    }

    changeUserSettings(userSettingsData: UserSettingsRequest) : Observable<UserSettingsResponse> {
        const usUrl: string = this.baseUrl + '/user_settings';
        return this.http.post<UserSettingsResponse>(usUrl, modelToFormData(userSettingsData));
    }
}
