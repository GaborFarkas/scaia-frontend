import { HttpClient } from '@angular/common/http';
import { noUndefined } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/global';
import { Product } from '../models/product.model';
import { ProductLayerStyle } from '../models/productlayerstyle.model';
import { ProductMap } from '../models/productmap.model';

@Injectable({ providedIn: 'root' })
export default class ConfigService {
    private cache: object = {};
    private baseUrl: string = GlobalConstants.baseUrl;

    constructor(private http: HttpClient) { }

    /**
     * Returns the product config in a promise
     */
    public async getProductsAsync(): Promise<Product> {
        const productUrl = this.baseUrl + '/get_config?config=product.json';

        if (!this.cache['products']) {
            const raw = await this.http.get<Product>(productUrl).toPromise();
            this.prepareProducts(raw);

            this.cache['products'] = raw;
        }

        return this.cache['products'];
    }

    /**
     * Returns the static map configurations.
     */
    public async getMapsAsync(): Promise<Record<string, ProductMap>> {
        const mapUrl = this.baseUrl + '/get_config?config=maps_static.json';

        if (!this.cache['maps']) {
            this.cache['maps'] = await this.http.get<Record<string, ProductMap>>(mapUrl).toPromise();
        }

        return this.cache['maps'];
    }

    /**
     * Returns a style for every vector layer result.
     */
    public async getStylesAsync(): Promise<Record<string, ProductLayerStyle>> {
        const styleUrl = this.baseUrl + '/get_config?config=style.json';

        if (!this.cache['styles']) {
            this.cache['styles'] = await this.http.get<Record<string, ProductLayerStyle>>(styleUrl).toPromise();
        }

        return this.cache['styles'];
    }

    /**
     * Returns the vector style associated with the base vector layer.
     */
    public async getBaseStyleAsync(): Promise<ProductLayerStyle> {
        const styleUrl = this.baseUrl + '/get_config?config=basemap.style.json';

        if (!this.cache['basestyle']) {
            this.cache['basestyle'] = await this.http.get<ProductLayerStyle>(styleUrl).toPromise();
        }

        return this.cache['basestyle'];
    }

    /**
     * Prepares the product list by extending the raw JSON with prev nodes.
     */
    private prepareProducts(node: Product): void {
        if (node.items && node.items.length) {
            for (let i = 0; i < node.items.length; ++i) {
                node.items[i].prev = node;
                this.prepareProducts(node.items[i]);
            }
        }
    }
}
