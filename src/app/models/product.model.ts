export interface Product {
    name: string,
    type: EntryType,
    icon: string,
    items?: Product[],
    id?: string,
    inputs?: ProductInput[]
}

export interface ProductInput {
    name: string,
    type: ProductInputType
}

export enum EntryType {
    CATEGORY = 'category',
    PROCESS = 'process'
}

export enum ProductInputType {
    DATE = 'date',
    INTERVAL = 'interval'
}
