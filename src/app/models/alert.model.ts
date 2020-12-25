export interface Alert {
    type: AlertType,
    message: string,
    top?: number
}

export enum AlertType {
    ERROR = "alert-danger",
    WARNING = "alert-warning",
    SUCCESS = "alert-success"
}