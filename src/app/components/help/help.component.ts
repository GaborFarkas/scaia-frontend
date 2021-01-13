import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertType } from 'src/app/models/alert.model';
import { Product } from 'src/app/models/product.model';
import AlertService from 'src/app/services/alert.service';
import ConfigService from 'src/app/services/config.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['../addNewJob/addNewJob.component.css']
})
export class HelpComponent implements OnInit {
    public activeNode: Product;

    constructor(
      private configService: ConfigService,
      private alertService: AlertService,
      private router: Router) {}

    ngOnInit(): void {
      this.getConfig();
    }

    /**
     * Listener called when the user clicks on a GUI category button.
     * @param item
     */
    public navigateTo(item: Product) {
      this.activeNode = item;
    }

    /**
     * Listener called when the user clicks on the Back button.
     */
    public goBack() {
      this.activeNode = this.activeNode.prev;
    }

    /**
     * Saves the product configuration to generate the buttons from.
     */
    private async getConfig() {
      try {
        this.activeNode = await this.configService.getHelpAsync();
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
