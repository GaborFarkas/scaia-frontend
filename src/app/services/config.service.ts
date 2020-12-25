import { HttpClient } from '@angular/common/http';
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
    public async getProductsAsync(): Promise<Product[]> {
        const productUrl = this.baseUrl + '/get_config?config=product.json';

        if (!this.cache['products']) {
            this.cache['products'] = await this.http.get<Product[]>(productUrl).toPromise();
        }
        
        return this.cache['products'];
    }
}