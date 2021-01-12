export interface ProductLayerStyle {
    type: ProductLayerStyleType,
    column: string,
    categories?: ProductLayerStyleCategory[]
}

export interface ProductLayerStyleCategory {
    value: string,
    legend: string,
    fill: string,
    stroke: string,
    strokeWidth: number
}

export enum ProductLayerStyleType {
    CATEGORIZED = 'categorized'
}
