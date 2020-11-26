import { LoginError } from './login.model';

export interface SingupRequest {
    username: string,
    fname: string,
    lname: string,
    email: string,
    password: string,
    confirm: string,
    csrf: string
}

export interface SignupResponse {
    registrationDisabled?: boolean;
    token?: string;
    error?: LoginError|null;
    recaptcha?: boolean;
    minUserLength?: number;
    maxUserLength?: number;
    minPwLength?: number;
    maxPwLength?: number;
}