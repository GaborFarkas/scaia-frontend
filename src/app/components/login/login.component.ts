import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html'
})
export class LoginComponent {
    @Output() modeChanged = new EventEmitter<string>();

    public changeMode() {
        this.modeChanged.emit('register');
    }
}
