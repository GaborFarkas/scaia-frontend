export interface ResetPasswdRequest {
    password: string;
    confirm: string;
    csrf: string;
}

export interface ResetPasswdResponse {
    token?: string;
    error?: ResetPasswdError|null;
    minPwLength?: number;
    maxPwLength?: number;
}

export enum ResetPasswdError {
    NONE = '',
    INPUT = 'input',
    TOKEN = 'token',
    EXPIRED = 'expired',
    SERVER = 'server'
}