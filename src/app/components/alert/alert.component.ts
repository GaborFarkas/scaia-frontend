import { Component } from '@angular/core';
import { Alert } from 'src/app/models/alert.model';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent {
    public alerts: Alert[];

    public destroyAlert(): void {
        this.alerts = [];
        console.log(this.alerts);
    }
}
