import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertType } from 'src/app/models/alert.model';
import { EntryType, Product } from 'src/app/models/product.model';
import { HomePage } from 'src/app/pages/home';
import AlertService from 'src/app/services/alert.service';
import ConfigService from 'src/app/services/config.service';

@Component({
  selector: 'app-addNewJob',
  templateUrl: './addNewJob.component.html',
  styleUrls: ['./addNewJob.component.css']
})

export class AddNewJobComponent implements OnInit {
  public activeNode: Product;

  @Output() close = new EventEmitter();
  @Output() showMap = new EventEmitter<string>();

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
    if (item.type === EntryType.MAP) {
        this.showMap.emit(item.id);
        this.close.emit();
    }
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
      this.activeNode = await this.configService.getProductsAsync();
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
