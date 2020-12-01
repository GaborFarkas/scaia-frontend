import { trigger } from '@angular/animations';
import { Component, EventEmitter, NgModule, Output, ViewChild, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import ZoomToExtent from 'ol/control/ZoomToExtent';
import { defaults as defaultControls } from 'ol/control';
import AuthService from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'home.page.html' ,
  styleUrls: [ './home.page.css' ],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements AfterViewInit {

  map: Map;

  constructor(
    private authService: AuthService,
    private router: Router) {}

  ngAfterViewInit() {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: [2213079.7791264898, 5939220.284081122],
        zoom: 8
      }),
      controls: defaultControls().extend([
        new ZoomToExtent({
          extent: [
            2053079.7791264898, 5719220.284081122,
            2383079.7791264898, 6209220.284081122
          ]
        })
      ])
    });
  }

  public mode: string = "";

  public changeMode(newMode: string ) {
    if(this.mode === newMode) {
      this.mode = "";
    } else {
      this.mode = newMode;
    }
  }

  /**
   * Logs out the current user from the application and redirects to the login page.
   */
  public logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(["login"]);
    });
  }

}
