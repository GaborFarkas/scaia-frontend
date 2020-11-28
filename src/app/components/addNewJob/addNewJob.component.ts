import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HomePage } from 'src/app/pages/home';

@Component({
  selector: 'app-addNewJob',
  templateUrl: './addNewJob.component.html',
  styleUrls: ['./addNewJob.component.css']
})

export class AddNewJobComponent {

  content_title1 = "Add new job";
  ngOnInit(): void {
  }

}
