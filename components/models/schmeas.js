export const Product = {
    name: 'Product', 
    properties: {
        id: 'int',
        name: 'string',
        sku: 'string',
        stock: 'int',
        image: 'string',
        supplier: 'string',
        barcode: 'string'
    }
}

export const Transfer = {
    name: 'Transfer',
    properties: {
        id: 'int',
        user_id: 'int',
        user_name: 'string',
        user_email: 'string',
        status: 'string',
        created_at: 'string',
        updated_at: 'string',
        synced: { type: 'bool', default: false }, 
        products: 'TransferItem[]'
    }
}

export const TransferItem = {
    name: 'TransferItem',
    properties: {
        id: 'int',
        transfer_id: 'int',
        product_id: 'int',
        item_name: 'string',
        item_sku: 'string',
        item_barcode: 'string',
        item_price: 'int',
        item_quantity: 'int',
        item_new_quantity: 'int',
        item_comments: 'string',
        for_delete: 'int',
        created_at: 'string',
        updated_at: 'string'
    }
}