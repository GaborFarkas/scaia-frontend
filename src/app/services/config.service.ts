import { HttpClient } from '@angular/common/http';
import { noUndefined } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/global';
import { Product } from '../models/product.model';

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