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

/**
 * Get the Product with the provided ID.
 * @param node
 * @param id
 */
export function getNodeById(node: Product, id: string): Product {
    if (node.id === id) {
        return node;
    } else if (node.items) {
        for (let i = 0; i < node.items.length; ++i) {
            const child = this.getNodeById(node.items[i], id);
            if (child) {
                return child;
            }
        }
    }

    return null;
}
