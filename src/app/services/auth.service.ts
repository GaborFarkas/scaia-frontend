import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/login.model';
import { modelToFormData } from '../utils/form.util';
import { SignupResponse, SingupRequest } from '../models/signup.model';

@Injectable({ providedIn: 'root' })
export default class AuthService {
    private baseUrl: string = '/api';

    // Used for development
    //private baseUrl: string = 'http://localhost/dalmand_backend/api';
    //private baseUrl: string = 'https://sentinel12.ttk.pte.hu/api';

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
}