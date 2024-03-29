import { HttpClient } from '@angular/common/http';
import { noUndefined } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/global';
import { EntryType, Product } from '../models/product.model';
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
            this.prepareProducts(raw, false);

            this.cache['products'] = raw;
        }

        return this.cache['products'];
    }

    /**
     * Returns the help config in a promise
     */
    public async getHelpAsync(): Promise<Product> {
        const helpUrl = this.baseUrl + '/get_config?config=product.json';

        if (!this.cache['help']) {
            const raw = await this.http.get<Product>(helpUrl).toPromise();
            this.convertToHelp(raw);
            this.prepareProducts(raw, true);

            this.cache['help'] = raw;
        }

        return this.cache['help'];
    }

    public async getHelpCardsAsync(node: Product): Promise<void> {
        const helpCardUrl = this.baseUrl + '/get_help?category=' + node.id;

        if (!this.cache['help']) {
            await this.getHelpAsync();
        }

        this.http.get<Product[]>(helpCardUrl).subscribe(data => {
            node.items = data;

            for (let i = 0; i < node.items.length; ++i) {
                node.items[i].prev = node;
            }
        });
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
    private prepareProducts(node: Product, help: boolean): void {
        if (node.items && node.items.length) {
            for (let i = 0; i < node.items.length; ++i) {
                if ((!help && node.items[i].type === EntryType.HELP) || (help && this.isEmptyCategory(node.items[i]))) {
                    // If this is a help node in a process config, remove it.
                    // Also, if it is an empty category node, remove it from the help config, as it cannot hold entries.
                    node.items.splice(i, 1);
                    // Reduce the index, as splicing is done in-place and now the array has one less element.
                    i -= 1;
                } else {
                    node.items[i].prev = node;
                    this.prepareProducts(node.items[i], help);
                }
            }
        }
    }

    /**
     * Converts the product config to help config.
     * @param node
     */
    private convertToHelp(node: Product): void {
        node.name = 'Help';
    }

    /**
     * Returns true if provided Product node is an empty category.
     * @param node
     */
    private isEmptyCategory(node: Product): boolean {
        return node.type === EntryType.CATEGORY && (!node.items || !node.items.length);
    }

    /**
     * Get the Product with the provided ID.
     * @param node
     * @param id
     */
    public getProductById(node: Product, id: string): Product {
        if (node.id === id) {
            return node;
        } else if (node.items) {
            for (let i = 0; i < node.items.length; ++i) {
                const child = this.getProductById(node.items[i], id);
                if (child) {
                    return child;
                }
            }
        }

        return null;
    }
}
