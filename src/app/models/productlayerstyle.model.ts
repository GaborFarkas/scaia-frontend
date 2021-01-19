export interface ProductLayerStyle {
    type: ProductLayerStyleType,
    column: string,
    categories?: ProductLayerStyleCategory[],
    default?: ProductLayerVectorStyle
}

export interface ProductLayerStyleCategory {
    value: string,
    legend: string,
    style: ProductLayerVectorStyle
}

export interface ProductLayerVectorStyle {
    fill: string,
    stroke: string,
    strokeWidth: number
}

export enum ProductLayerStyleType {
    CATEGORIZED = 'categorized'
}
