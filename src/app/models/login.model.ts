import { UserData } from './userdata.model';

export interface LoginModel {
    token?: string;
    userData?: UserData;
    banned?: boolean;
    error?: string|null;
}