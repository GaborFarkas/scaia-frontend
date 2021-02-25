export interface ProductLayer {
    id: string,
    type: ProductLayerType,
    name: string
}

export enum ProductLayerType {
    VECTOR = 'vector',
    RASTER = 'raster'
}
