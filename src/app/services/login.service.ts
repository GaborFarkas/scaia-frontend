import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginModel } from '../models/login.model';

@Injectable({ providedIn: 'root' })
export default class LoginService {
    private loginUrl: string = '/api/login';

    // Used for development
    //private loginUrl: string = 'http://localhost/dalmand_backend/api/login';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { }

    getData(): Observable<LoginModel> {
        return this.http.get<LoginModel>(this.loginUrl);
    }
}