import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html'
})
export class RegisterComponent {
    @Output() modeChanged = new EventEmitter<string>();

    public changeMode() {
        this.modeChanged.emit('login');
    }
}
