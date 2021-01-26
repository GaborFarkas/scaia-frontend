export interface ProductLayer {
    id: string,
    type: ProductLayerType,
    name: string,
    mapfile?: string
}

export enum ProductLayerType {
    VECTOR = 'vector',
    RASTER = 'raster'
}
