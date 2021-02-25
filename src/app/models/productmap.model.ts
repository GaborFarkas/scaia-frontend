import { ProductLayer } from './productlayer.model';

export interface ProductMap {
    name: string,
    mapfile?: string,
    layers: ProductLayer[]
}
