import { Injectable } from '@angular/core';
import { AlertComponent } from '../components/alert';
import { AlertType } from '../models/alert.model';

@Injectable({ providedIn: 'root' })
export default class AlertService {
    private alertComp: AlertComponent;

    public register(alert: AlertComponent): void {
        this.alertComp = alert;
    }

    public alert(type: AlertType, message: string, top?: number) {
        this.alertComp.alerts = [{
            type: type,
            message: message,
            top: top || 61
        }];
    }
}