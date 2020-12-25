import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertType } from 'src/app/models/alert.model';
import { Product } from 'src/app/models/product.model';
import { HomePage } from 'src/app/pages/home';
import AlertService from 'src/app/services/alert.service';
import ConfigService from 'src/app/services/config.service';

@Component({
  selector: 'app-addNewJob',
  templateUrl: './addNewJob.component.html',
  styleUrls: ['./addNewJob.component.css']
})

export class AddNewJobComponent implements OnInit {
  content_title1 = "Add new job";
  public config: Product[];

  constructor(
    private configService: ConfigService,
    private alertService: AlertService,
    private router: Router) {}

  ngOnInit(): void {
    this.getConfig();
  }

  /**
   * Saves the product configuration to generate the buttons from.
   */
  private async getConfig() {
    try {
      this.config = await this.configService.getProductsAsync();
    } catch (ex) {
      // If we get an Unauthorized response, the user is not allowed to use the app. Go back to the login page.
      if (ex.status === 401) {
        this.router.navigate(["login"]);
      } else {
        this.alertService.alert(AlertType.ERROR, "An unexpected error happened, please try again later.");
      }
    }
  }

}
