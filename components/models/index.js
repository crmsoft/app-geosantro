import Realm from 'realm';
import {
    Product,
    Transfer, 
    TransferItem
} from './schmeas';
import _ from 'lodash';
import { default_image } from '../../assets/img/default-image.json';

const _get = ( obj, path, def_value = '' ) => {
    let lodash_get = _.get(obj, path, def_value);

    return _.isNull(lodash_get) ? def_value : lodash_get;
}

export const synProducts = async ( dbInstance ) => {
    // fetch from back-end
    const rawResponse = await fetch('http://portal.geosantro.com/api/v1/stock-movement/products', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'api_key':''})
    });
    const content = await rawResponse.json();

    const list = _get(content, 'data', undefined);

    if(list){

        // fetch required fields from json...
        const data = list.map((product) => {
            const img_prefix = 'data:image/png;base64,';
            const first_name = _get(product,'relationships.supplier.attributes.first_name','-');
            const last_name = _get(product,'relationships.supplier.attributes.last_name','');
            return  {
                id: ~~product.id,
                name: _get(product,'attributes.name','-'),
                sku: _get(product,'attributes.sku','-'),
                stock: _get(product,'attributes.stock','-'),
                image: img_prefix + _get(product,'attributes.image', default_image),
                barcode: _get(product,'attributes.barcode','-'),
                supplier: `${first_name} ${last_name}`
            };
        });

        // save to db...
        /*Realm.open({
            schema: [ Product ],
            schemaVersion: 2
        }).then(realm => {*/
            // store fresh fields
            dbInstance.write(() => {
                // before store - remove old ones
                const old = dbInstance.objects(Product.name);
                if(old)
                    dbInstance.delete( old );
                // push items
                data.forEach(item => {
                    dbInstance.create(Product.name, item);                
                });
            });
        /*}).catch(error => {
            console.log(error);
        });*/
    }else{
        console.log( 'the response was unsuccessful' )
    }    
}

export const synTransfers = async ( dbInstance ) => {
    // fetch from back-end
    const rawResponse = await fetch('http://portal.geosantro.com/api/v1/stock-movement/transfers', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'api_key':''})
    })
    const content = await rawResponse.json();
    const list = _get(content, 'data', undefined);
    
    if(list){
        // fetch required fields from json...
        const data = list.map((product) => {
            
            const items = _get(product,'relationships.items', []);
            return {
                id: ~~product.id,
                user_id: ~~_get(product,'attributes.user_id', 0),
                user_name: _get(product,'attributes.user_name',''),
                user_email: _get(product,'attributes.user_email',''),
                status: _get(product,'attributes.status', 'pending'),
                created_at: _get(product,'attributes.created_at',''),
                updated_at: _get(product,'attributes.updated_at',''),
                synced: true,
                products: items.map( item => {
                    return{
                        id: ~~item.id,
                        transfer_id: ~~_get(item,'attributes.transfer_id', 0),
                        product_id: ~~_get(item,'attributes.product_id', 0),
                        item_name: _get(item,'attributes.item_name', ''),
                        item_sku: _get(item,'attributes.item_sku', ''),
                        item_barcode: _get(item,'attributes.item_barcode', ''),
                        item_price: ~~_get(item,'attributes.item_price', 0),
                        item_quantity: ~~_get(item,'attributes.item_quantity', 0),
                        item_new_quantity: ~~_get(item,'attributes.item_new_quantity', 0),
                        item_comments: _get(item,'attributes.item_comments', ''),
                        for_delete: ~~_get(item,'attributes.for_delete', 0),
                        created_at: _get(item,'attributes.created_at', ''),
                        updated_at: _get(item,'attributes.updated_at', '')
                    }
                })
            }
        });

        dbInstance.write(() => {
            // before store - remove old ones
            const old = dbInstance.objects(Transfer.name);
                if(old)

            data.forEach(item => {
                dbInstance.create(Transfer.name, item);                
            });
        });
        
    }else{
        console.log( 'the response was unsuccessful' )
    }    
}

export const listTransfers = () => {
    return Realm.open({
        schema: [ Transfer, TransferItem ],
        schemaVersion: 2
    });
}

export const listProducts = () => {
    return Realm.open({
        schema: [ Product, Transfer, TransferItem ],
        schemaVersion: 2
    });
}

export const instance = async () => {
    return Realm.open({
        schema: [ Product, Transfer, TransferItem ],
        schemaVersion: 2
    });
}