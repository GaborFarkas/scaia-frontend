import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-userSettings',
  templateUrl: './userSettings.component.html',
  styleUrls: ['./userSettings.component.css']
})
export class UserSettingsComponent {
  @Input() userNameInput: string;
  ngOnInit(): void {
  }
}
