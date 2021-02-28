import { AfterViewInit, Component, Input, SimpleChanges } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import MapService from 'src/app/services/map.service';
import AlertService from 'src/app/services/alert.service';
import { AlertType } from 'src/app/models/alert.model';
import { Router } from '@angular/router';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileWMS from 'ol/source/TileWMS';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import ConfigService from 'src/app/services/config.service';
import { config } from 'process';
import BaseLayer from 'ol/layer/Base';
import { ProductLayer, ProductLayerType } from 'src/app/models/productlayer.model';
import { ProductLayerStyleCategory, ProductLayerStyleType, ProductLayerVectorStyle } from 'src/app/models/productlayerstyle.model';
import Fill from 'ol/style/Fill';
import { ProductMap } from 'src/app/models/productmap.model';
import LayerGroup from 'ol/layer/Group';
import Layer from 'ol/layer/Layer';
import LayerSwitcher from 'src/app/ol/control/ol.control.layerswitcher';
import { GlobalConstants } from 'src/global';

@Component({
    selector: 'app-map',
    templateUrl: 'map.component.html',
    styleUrls: ['map.component.css']
})
export class MapComponent implements AfterViewInit {
    private map: Map;

    @Input() canLoadData: boolean;

    constructor(
        private mapService: MapService,
        private alertService: AlertService,
        private configService: ConfigService,
        private router: Router) { }

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
            controls: [new LayerSwitcher()]
        });

        this.map.getLayers().getArray()[0].set('name', 'OpenStreetMap');
    }

    /**
     * Load the data when a logged-in user is detected to avoid false unauthorized errors.
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (this.canLoadData) {
            this.addLayer();
        }
    }

    /**
     * Adds a product map (set of layers) to the map.
     * @param mapId Id of the product map. If empty, the base vector layer is loaded.
     */
    public async addMap(mapId: string): Promise<void> {
        const mapConf = await this.configService.getMapsAsync();
        let conf: ProductMap;

        if (mapConf[mapId]) {
            // This is a static map.
            conf = mapConf[mapId];

            this.addMapInternal(conf, mapId);
        } else {
            // This is a dynamic map. The layer IDs must contain the generation date.
            this.mapService.getMap(mapId).subscribe(data => {
                this.addMapInternal(data, mapId);
            },
            err => {
                // If we get an Unauthorized response, the user is not allowed to use the app. Go back to the login page.
                if (err.status === 401) {
                    this.router.navigate(["login"]);
                    // Else if the response is Forbidden, the user is not allowed to see the data.
                } else if (err.status === 403) {
                    this.alertService.alert(AlertType.ERROR, 'You are not eligible to access proprietary data. Sorry.');
                } else if (err.status === 404) {
                    this.alertService.alert(AlertType.ERROR, 'The selected map could not be found.');
                }
            });
        }


    }

    /**
     * Adds a product map (set of layers) to the map. Shared functionality between static and dynamic maps.
     * @param conf
     * @param mapId
     */
    private addMapInternal(conf: ProductMap, mapId: string) {
        for (let i = 0; i < conf.layers.length; ++i) {
            this.addLayer(conf, conf.layers[i], mapId);
        }
    }

    /**
     * Adds a single layer to the map. If the layer is already present, sets its visibility to true.
     * @param layer Layer descriptor for the layer to add
     * @param groupId ID of the layer group this layer belongs to
     */
    public async addLayer(conf?: ProductMap, layer?: ProductLayer, mapId?: string): Promise<void> {
        // Map ID can be a group ID or layer ID. If it is a group ID, it cannot be a layer ID.
        // If we have a single layer in the group, we don't need a group at all.
        const groupId = conf?.layers.length === 1 ? null : mapId;
        // If we have a groupId, we must also have a layer as well.
        const layerId = groupId ? layer.id : mapId;
        // layerId will be only null when the base layer is loaded.
        const lyr = this.getLayer(layerId || 'baselayer', groupId);

        if (lyr) {
            lyr.setVisible(true);
        } else {
            let grp: LayerGroup;
            if (mapId) {
                grp = this.getOrCreateGroup(mapId, conf.name);
            }

            if (!layer || layer.type === ProductLayerType.VECTOR) {
                await this.addVectorLayer(layer, mapId, grp);
            } else {
                await this.addRasterLayer(layer, conf.mapfile, grp);
            }
        }
    }

    /**
     * Adds a new vector layer (GeoJSON) to the map.
     * @param layer Layer description
     * @param group Layer group to put this layer in
     */
    private async addVectorLayer(layer?: ProductLayer, mapId?: string, group?: LayerGroup): Promise<void> {
        const style = layer ? (await this.configService.getStylesAsync())[layer.id] : await this.configService.getBaseStyleAsync();

        this.mapService.getVectorLayer(layer ? layer.id : undefined, mapId).subscribe(data => {
            const lyr = new VectorLayer({
                source: new VectorSource({
                    features: new GeoJSON().readFeatures(data)
                }),
                style: function (feature): Style[] {
                    if (style.type === ProductLayerStyleType.CATEGORIZED) {
                        const val = feature.get(style.column);
                        if (val) {
                            return [this.getCategorizedStyle(val, style.categories, style.default)];
                        }
                    } else if (style.type === ProductLayerStyleType.BINNED) {
                        const val = feature.get(style.column);
                        if (val) {
                            return [this.getBinnedStyle(val, style.categories, style.default)];
                        }
                    }

                    // If we cannot find a style for the feature, return an empty Style object, hiding it.
                    return [style.default ? this.convertToStyleObject(style.default) : new Style()];
                }.bind(this)
            });
            lyr.set('name', layer ? layer.name : 'Parcelles');
            lyr.set('prodId', layer ? layer.id : 'baselayer');
            lyr.set('descriptor', style);

            if (group) {
                group.getLayers().push(lyr);
            } else {
                this.map.addLayer(lyr);
            }
        },
            err => {
                // If we get an Unauthorized response, the user is not allowed to use the app. Go back to the login page.
                if (err.status === 401) {
                    this.router.navigate(["login"]);
                    // Else if the response is Forbidden, the user is not allowed to see the data.
                } else if (err.status === 403) {
                    this.alertService.alert(AlertType.ERROR, 'You are not eligible to access proprietary data. Sorry.');
                } else if (err.status === 404) {
                    this.alertService.alert(AlertType.ERROR, 'One of the layers in the selected map could not be found.');
                }
            });
    }

    /**
     * Adds a new raster layer (WMS) to the map.
     * @param layer Layer description
     */
    private async addRasterLayer(layer: ProductLayer, mapfile: string, group: LayerGroup): Promise<void> {
        const style = (await this.configService.getStylesAsync())[layer.id];

        const lyr = new TileLayer({
            source: new TileWMS({
                url: GlobalConstants.baseUrl + '/mapserv?map=' + mapfile,
                params: {
                    layers: layer.id
                }
            })
        });
        lyr.set('name', layer ? layer.name : 'Parcelles');
        lyr.set('prodId', layer ? layer.id : 'baselayer');
        lyr.set('descriptor', style);

        if (group) {
            group.getLayers().push(lyr);
        } else {
            this.map.addLayer(lyr);
        }
    }

    /**
     * Returns a layer with the provided product ID.
     * @param id
     */
    private getLayer(id: string, groupId?: string): BaseLayer {
        let layers: BaseLayer[];

        if (groupId) {
            // If we have a groupId, find the correct layer group.
            const group = this.map.getLayers().getArray().find((l: BaseLayer) => l.get('groupId') === groupId);
            if (group) {
                // If the layer group exists, search within its layer collection.
                layers = (group as LayerGroup).getLayers().getArray();
            } else {
                // If not, return undefined, so we can create a new group.
                return undefined;
            }
        } else {
            // If we don't have a groupId, it is not a grouped layer, search within the map's layer collection.
            layers = this.map.getLayers().getArray();
        }

        return layers.find((l: BaseLayer) => l.get('prodId') === id);
    }

    /**
     * Finds and returns an existing layer group or creates it.
     */
    private getOrCreateGroup(id: string, name: string): LayerGroup {
        const group = this.map.getLayers().getArray().find((l: BaseLayer) => l instanceof LayerGroup && l.get('groupId') === id);

        if (group) {
            return group as LayerGroup;
        } else {
            const grp = new LayerGroup();
            grp.set('groupId', id);
            grp.set('name', name);
            this.map.addLayer(grp);

            return grp;
        }
    }

    /**
     * Returns a Style object based on the category the input value falls into.
     * @param value Input value
     * @param categories List of categories
     */
    private getCategorizedStyle(value: string, categories: ProductLayerStyleCategory[], defaultStyle?: ProductLayerVectorStyle): Style {
        const cat = categories.find(c => c.value === value);

        if (cat) {
            return this.convertToStyleObject(cat.style);
        } else {
            return defaultStyle ? this.convertToStyleObject(defaultStyle) : new Style();
        }
    }

    /**
     * Returns a Style objecgt based on the interval (bin) the input value falls into.
     * @param value
     * @param categories
     * @param defaultStyle
     */
    private getBinnedStyle(value: number, categories: ProductLayerStyleCategory[], defaultStyle?: ProductLayerVectorStyle): Style {
        const bin = categories.find((c, i) => (i ? c.values[0] < value : c.values[0] <= value) && c.values[1] >= value);

        if (bin) {
            return this.convertToStyleObject(bin.style);
        } else {
            return defaultStyle ? this.convertToStyleObject(defaultStyle) : new Style();
        }
    }

    /**
     * Converts a style descriptor to an OL style object
     * @param desc
     */
    private convertToStyleObject(desc: ProductLayerVectorStyle): Style {
        return new Style({
            fill: new Fill({
                color: desc.fill
            }),
            stroke: new Stroke({
                color: desc.stroke,
                width: desc.strokeWidth
            })
        });
    }
}
