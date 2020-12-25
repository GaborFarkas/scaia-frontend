import { AfterViewInit, Component } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import ZoomToExtent from 'ol/control/ZoomToExtent';
import { defaults as defaultControls } from 'ol/control';
import MapService from 'src/app/services/map.service';
import AlertService from 'src/app/services/alert.service';
import { AlertType } from 'src/app/models/alert.model';

@Component({
    selector: 'app-map',
    templateUrl: 'map.component.html',
    styleUrls: [ 'map.component.css' ]
})
export class MapComponent implements AfterViewInit {
    private map: Map;

    constructor(
      private mapService: MapService,
      private alertService: AlertService) {}

    ngAfterViewInit(): void {
        this.map = new Map({
            target: 'olMap',
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
            controls: []/*defaultControls().extend([
              new ZoomToExtent({
                extent: [
                  2053079.7791264898, 5719220.284081122,
                  2383079.7791264898, 6209220.284081122
                ]
              })
            ])*/
        });

        this.mapService.getMap().subscribe(data => {

        },
        err => {
          if (err.status === 403) {
            this.alertService.alert(AlertType.ERROR, 'You are not eligiable to access Dalmand Zrt. proprietary data. Sorry.');
          }
        });
    }
}
