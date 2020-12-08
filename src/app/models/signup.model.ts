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
    error?: SignupError|null;
    recaptcha?: boolean;
    minUserLength?: number;
    maxUserLength?: number;
    minPwLength?: number;
    maxPwLength?: number;
}

export enum SignupError {
    NONE = '',
    INPUT = 'input',
    TOKEN = 'token',
    RECAPTCHA = 'recaptcha',
    SERVER = 'server',
    USERNAME = 'username',
    EMAIL = 'email',
    NOTEMAIL = 'notemail'
}