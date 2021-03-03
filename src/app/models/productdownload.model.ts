import { ProductLayerType } from './productlayer.model';

export interface ProductMapDownload {
    name: string,
    layers: ProductLayerDownload[]
}

export interface ProductLayerDownload {
    id: string,
    type: ProductLayerType,
    name: string,
    available: boolean,
    size: number
}
