import { AfterViewInit, Component } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import ZoomToExtent from 'ol/control/ZoomToExtent';
import { defaults as defaultControls } from 'ol/control';

@Component({
    selector: 'app-map',
    templateUrl: 'map.component.html',
    styleUrls: [ 'map.component.css' ]
})
export class MapComponent implements AfterViewInit {
    private map: Map;

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
    }
}
