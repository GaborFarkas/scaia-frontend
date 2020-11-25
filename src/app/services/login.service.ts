import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/login.model';
import { modelToFormData } from '../utils/form.util';

@Injectable({ providedIn: 'root' })
export default class LoginService {
    private loginUrl: string = '/api/login';

    // Used for development
    //private loginUrl: string = 'http://localhost/dalmand_backend/api/login';

    constructor(private http: HttpClient) { }

    getData(): Observable<LoginResponse> {
        return this.http.get<LoginResponse>(this.loginUrl);
    }

    login(loginData: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(this.loginUrl, modelToFormData(loginData));
    }
}