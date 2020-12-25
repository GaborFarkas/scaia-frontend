import { Injectable } from '@angular/core';
import { AlertComponent } from '../components/alert';

@Injectable({ providedIn: 'root' })
export default class AlertService {
    private alertComp: AlertComponent;

    public register(alert: AlertComponent): void {
        this.alertComp = alert;
    }

    public alert(type: string, message: string) {
        this.alertComp.alerts = [{
            type: type,
            message: message
        }];
    }
}