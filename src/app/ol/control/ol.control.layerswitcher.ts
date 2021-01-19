import { PluggableMap } from 'ol';
import Control, { Options } from 'ol/control/Control';
import BaseLayer from 'ol/layer/Base';
import LayerGroup from 'ol/layer/Group';
import { ProductLayerStyle, ProductLayerVectorStyle } from 'src/app/models/productlayerstyle.model';

/**
 * Layer switcher control with legend display. Can control visibility of layers and groups, and can remove individual layers or whole groups.
 */
export default class LayerSwitcher extends Control {
    private container: HTMLDivElement;
    private map: PluggableMap;
    private entries: Record<string, HTMLDivElement>;
    private lyrCount: number;
    private hide: boolean;

    private get nextId(): string {
        // Initialize counter on first run.
        if (!this.lyrCount) {
            this.lyrCount = 0;
        }

        // Increase counter before returning.
        return 'entry-' + ++this.lyrCount;
    }

    constructor(opt_options?: Options) {
        const options = opt_options || {};

        const element = document.createElement('div');
        element.className = 'ol-layerswitcher ol-unselectable ol-control';

        const lbl = document.createElement('div');
        lbl.className = 'ol-layerswitcher-title';
        lbl.textContent = 'Layers';
        element.appendChild(lbl);

        const lyrContainer = document.createElement('div');
        lyrContainer.className = 'ol-layerswitcher-container';
        element.appendChild(lyrContainer);

        super({
            element: element,
            target: options.target
        });

        this.container = lyrContainer;
        this.entries = {};

        lbl.addEventListener('click', function() {
            this.hide = !this.hide;

            lyrContainer.style.maxHeight = this.hide ? '0' : '';
        }.bind(this));
    }

    /**
     * Method called when the control is added to the map.
     * Initialize control for layers aready present.
     * @param map
     */
    public setMap(map: PluggableMap) {
        this.clearLayers();

        super.setMap(map);

        this.map = map;

        if (map) {
            const lyrs = map.getLayers();
            lyrs.forEach(l => {
                if (l instanceof LayerGroup) {
                    this.addLayerGroup(l);
                } else {
                    this.addLayerEntry(l, this.container);
                }
            });

            map.getLayers().on('remove', function(evt) {
                const id = evt.element.get('switcherId');
                // Only try to remove entries if they are in the entry list.
                if (id && this.entries[id]) {
                    this.entries[id].remove();
                }
            }.bind(this));

            map.getLayers().on('add', function(evt) {
                if (evt.element instanceof LayerGroup) {
                    this.addLayerGroup(evt.element);
                } else {
                    this.addLayerEntry(evt.element, this.container);
                }
            }.bind(this))
        }
        console.log(map.getLayers().getArray());
    }

    /**
     * Adds an entry for a single layer, including controls and a legend, if applicable.
     * @param layer
     * @param container
     */
    private addLayerEntry(layer: BaseLayer, container: HTMLDivElement, group?: LayerGroup) {
        const legendBase = layer.get('descriptor') as ProductLayerStyle;

        const entry = document.createElement('div');
        entry.className = 'ol-layerswitcher-layer';

        const head = this.createHeader(layer, group);
        entry.appendChild(head);

        if (legendBase) {
            const legend = this.createLegend(legendBase);

            head.addEventListener('click', function(evt) {
                evt.stopPropagation();

                legend.style.height = legend.style.height ? '' : '0';
            });

            entry.appendChild(legend);
        }

        container.appendChild(entry);

        const id = this.nextId;
        this.entries[id] = entry;
        layer.set('switcherId', id);
    }

    /**
     * Creates an entry for a layer group and adds event listeners to it.
     */
    private addLayerGroup(group: LayerGroup) {
        const groupCont = document.createElement('div');
        groupCont.className = 'ol-layerswitcher-group';

        const head = this.createHeader(group);
        groupCont.appendChild(head);

        const lyrs = document.createElement('div');
        lyrs.className = 'ol-layerswitcher-group-container';
        groupCont.appendChild(lyrs);

        head.addEventListener('click', function(evt) {
            evt.stopPropagation();

            lyrs.style.height = lyrs.style.height ? '' : '0';
        })

        group.getLayers().forEach(l => {
            this.addLayerEntry(l, lyrs, group);
        });

        group.getLayers().on('add', function(evt) {
            this.addLayerEntry(evt.element, lyrs, group);
        }.bind(this));

        group.getLayers().on('remove', function(evt) {
            const id = evt.element.get('switcherId');
            // Only try to remove entries if they are in the entry list.
            if (id && this.entries[id]) {
                this.entries[id].remove();
            }

            if (group.getLayers().getLength() < 2) {
                // This is the last layer in the group, remove it altogether.
                this.map.getLayers().remove(group);
            }
        }.bind(this));

        this.container.appendChild(groupCont);

        const id = this.nextId;
        this.entries[id] = groupCont;
        group.set('switcherId', id);
    }

    /**
     * Creates a header div for a layer or a layer group.
     */
    private createHeader(layer: BaseLayer, group?: LayerGroup): HTMLDivElement {
        const name = layer.get('name');
        const canRemove = layer.get('prodId') || layer.get('groupId');

        const head = document.createElement('div');
        head.className = 'ol-layerswitcher-header';

        const lyrName = document.createElement('div');
        lyrName.className = 'ol-layerswitcher-name';
        lyrName.textContent = name || 'Unknown layer';
        head.title = lyrName.textContent;
        head.appendChild(lyrName);

        const controls = document.createElement('div');
        head.appendChild(controls);

        const visBtn = document.createElement('div');
        visBtn.className = 'ol-layerswitcher-btn';
        const eye = document.createElement('i');
        eye.className = layer.getVisible() ?  'fas fa-eye' : 'fas fa-eye-slash';
        visBtn.appendChild(eye);

        visBtn.addEventListener('click', function(evt) {
            evt.stopPropagation();
            layer.setVisible(!layer.getVisible());
            eye.className = layer.getVisible() ?  'fas fa-eye' : 'fas fa-eye-slash';
        });

        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'ol-layerswitcher-btn';
        const trash = document.createElement('i');
        trash.className = 'fas fa-trash-alt';
        deleteBtn.appendChild(trash);

        if (canRemove) {
            const map = this.map;
            deleteBtn.addEventListener('click', function(evt) {
                evt.stopPropagation();
                if (group) {
                    group.getLayers().remove(layer);
                } else {
                    map.removeLayer(layer);
                }
            });
        } else {
            deleteBtn.classList.add('disabled');
        }

        controls.appendChild(visBtn);
        controls.appendChild(deleteBtn);

        layer.on('propertychange', function(evt) {
            if (evt.key === 'name') {
                lyrName.textContent = evt.target.get(evt.key);
                head.title = evt.target.get(evt.key);
            }
        });

        return head;
    }

    /**
     * Creates a legend div from a style descriptor.
     * @param style
     */
    private createLegend(style: ProductLayerStyle): HTMLDivElement {
        const legendCont = document.createElement('div');
        legendCont.className = 'ol-layerswitcher-legend';

        if (style.categories) {
            for (let i = 0; i < style.categories.length; ++i) {
                legendCont.appendChild(this.createLegendEntry(style.categories[i].legend, style.categories[i].style));
            }
        }

        if (style.default) {
            legendCont.appendChild(this.createLegendEntry('', style.default));
        }

        return legendCont;
    }

    /**
     * Creates a single legend row.
     */
    private createLegendEntry(name: string, style: ProductLayerVectorStyle): HTMLDivElement {
        const row = document.createElement('div');
        row.className = 'ol-layerswitcher-legend-row';

        const rect = document.createElement('div');
        rect.className = 'ol-layerswitcher-legend-rect';
        rect.style.borderColor = style.stroke;
        rect.style.borderStyle = 'solid';
        rect.style.borderWidth = style.strokeWidth + 'px';
        rect.style.backgroundColor = style.fill;
        row.appendChild(rect);

        const label = document.createElement('div');
        label.className = 'ol-layerswitcher-legend-label';
        label.textContent = name;
        row.appendChild(label);

        return row;
    }

    /**
     * Clears out the layer container of the control.
     */
    private clearLayers() {
        while (this.container.lastChild) {
            this.container.removeChild(this.container.lastChild);
        }
    }
}
