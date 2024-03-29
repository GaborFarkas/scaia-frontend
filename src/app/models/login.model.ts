import { UserData } from './userdata.model';

export interface LoginRequest {
    username: string,
    password: string,
    csrf: string
};

export interface LoginResponse {
    token?: string;
    userData?: UserData;
    banned?: boolean;
    error?: LoginError|null;
}

export enum LoginError {
    NONE = '',
    INPUT = 'input',
    TOKEN = 'token',
    RECAPTCHA = 'recaptcha',
    BANNED = 'banned',
    VERIFY = 'verify',
    SERVER = 'server'
}