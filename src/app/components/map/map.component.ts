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
import { Router } from '@angular/router';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

@Component({
    selector: 'app-map',
    templateUrl: 'map.component.html',
    styleUrls: [ 'map.component.css' ]
})
export class MapComponent implements AfterViewInit {
    private map: Map;

    constructor(
      private mapService: MapService,
      private alertService: AlertService,
      private router: Router) {}

      
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
              center: [2029079.7791264898, 5855220.284081122],
              zoom: 12
            }),
            controls: []
        });
        //defining style for different fields
        var style127 = new Style({
          stroke: new Stroke({
            color: 'green',
            width: 2
          })
        })

        var style129 = new Style({
          stroke: new Stroke({
            color: 'blue',
            width: 2
          })
        })
        var style111 = new Style({
          stroke: new Stroke({
            color: 'red',
            width: 2
          })
        })
        var styleDefault = new Style({
          stroke: new Stroke({
            color: 'black',
            width: 2
          })
        })

        function styleFunction(feature) {
          // get the C_cropID from the feature properties
          var C_cropID = feature.get('C_cropID');
          //log out the C_cropID values to terminal
          console.log(C_cropID);
          
          if(C_cropID == 127)
            return [style127]
          else if(C_cropID == 129)
            return [style129]
          else if(C_cropID == 111)
            return [style111]
          else
            return [styleDefault]
          }

        this.mapService.getMap().subscribe(data => {
          console.log(data);
          this.map.addLayer(new VectorLayer({
            source: new VectorSource({
              features: new GeoJSON().readFeatures(data)
            }),
            style: styleFunction
          }))
        },
        err => {
          // If we get an Unauthorized response, the user is not allowed to use the app. Go back to the login page.
          if (err.status === 401) {
            this.router.navigate(["login"]);
          // Else if the response is Forbidden, the user is not allowed to see the data.
          } else if (err.status === 403) {
            this.alertService.alert(AlertType.ERROR, 'You are not eligible to access Dalmand Zrt. proprietary data. Sorry.');
          }
        });

    }
}
