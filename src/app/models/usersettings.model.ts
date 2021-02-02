export interface UserSettingsRequest {
    username?: string,
    fname?: string,
    lname?: string,
    password?: string,
    confirm?: string,
    csrf: string
}

export interface UserSettingsResponse {
    canChangeUn?: boolean;
    token?: string;
    error?: UserSettingsError|null;
    recaptcha?: boolean;
    minUserLength?: number;
    maxUserLength?: number;
    minPwLength?: number;
    maxPwLength?: number;
}

export enum UserSettingsError {
    NONE = '',
    INPUT = 'input',
    TOKEN = 'token',
    RECAPTCHA = 'recaptcha',
    SERVER = 'server',
    USERNAME = 'username',
    NOTEMAIL = 'notemail',
    UNONLYONCE = 'unonlyonce',
    CANNOTCHANGEUN = 'cannotchangeun'
}
