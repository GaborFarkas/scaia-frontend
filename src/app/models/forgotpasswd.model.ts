export interface ForgotPasswdRequest {
    email: string;
    csrf: string;
}

export interface ForgotPasswdResponse {
    token?: string;
    error?: ForgotPasswdError|null;
}

export enum ForgotPasswdError {
    NONE = '',
    INPUT = 'input',
    TOKEN = 'token',
    USER = 'user',
    SERVER = 'server'
}