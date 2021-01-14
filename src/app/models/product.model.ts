export interface Product {
    name: string,
    type: EntryType,
    icon: string,
    items?: Product[],
    id?: string,
    inputs?: ProductInput[],
    prev?: Product
}

export interface ProductInput {
    name: string,
    type: ProductInputType
}

export enum EntryType {
    CATEGORY = 'category',
    PROCESS = 'process',
    MAP = 'map',
    HELP = 'help',
    CONTENT = 'content'
}

export enum ProductInputType {
    DATE = 'date',
    INTERVAL = 'interval'
}
