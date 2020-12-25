import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { HomePage } from 'src/app/pages/home';
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
      }
    }
  }

}
