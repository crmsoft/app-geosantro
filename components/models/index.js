import Realm from 'realm';
import {
    Product,
    Transfer, 
    TransferItem
} from './schmeas';
import _ from 'lodash';
import { default_image } from '../../assets/img/default-image.json';
import config from './config';

// date in format : D/MM/Y h:mm
export const getDate = () => {

    let date = new Date();
    
    let d = date.getDate()
    let m = 1 + date.getMonth();
    let y = date.getFullYear();

    let h = date.getHours();
    let i = date.getMinutes();

    let mm = m <= 9 ? `0${m}`:m;
    let dd = d <= 9 ? `0${d}`:d;
    let hh = h <= 9 ? `0${h}`:h;
    let ii = i <= 9 ? `0${i}`:i;

    return `${dd}/${mm}/${y} ${hh}:${ii}`
}

const _get = ( obj, path, def_value = '' ) => {
    let lodash_get = _.get(obj, path, def_value);

    return _.isNull(lodash_get) ? def_value : lodash_get;
}

const transferResponseToModel = ( list ) => {
    return list.map((transfer) => {
            
        const items = _get(transfer,'relationships.items', []);
        return {
            id: ~~transfer.id,
            user_id: ~~_get(transfer,'attributes.user_id', 0),
            user_name: _get(transfer,'attributes.user_name',''),
            user_email: _get(transfer,'attributes.user_email',''),
            status: _get(transfer,'attributes.status', 'pending'),
            created_at: _get(transfer,'attributes.created_at',''),
            updated_at: _get(transfer,'attributes.updated_at',''),
            synced: true,
            products: items.map( product => {
                return{
                    id: ~~product.id,
                    transfer_id: ~~_get(product,'attributes.transfer_id', 0),
                    product_id: ~~_get(product,'attributes.product_id', 0),
                    item_name: _get(product,'attributes.item_name', ''),
                    item_sku: _get(product,'attributes.item_sku', ''),
                    item_barcode: _get(product,'attributes.item_barcode', ''),
                    item_price: ~~_get(product,'attributes.item_price', 0),
                    item_quantity: ~~_get(product,'attributes.item_quantity', 0),
                    item_new_quantity: ~~_get(product,'attributes.item_new_quantity', 0),
                    item_comments: _get(product,'attributes.item_comments', ''),
                    for_delete: ~~_get(product,'attributes.for_delete', 0),
                    created_at: _get(product,'attributes.created_at', ''),
                    updated_at: _get(product,'attributes.updated_at', '')
                }
            })
        }
    });
}

export const synProducts = async ( dbInstance ) => {
    // fetch from back-end
    const rawResponse = await fetch('http://portal.geosantro.com/api/v1/stock-movement/products', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
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
        body: JSON.stringify(config)
    })
    const content = await rawResponse.json();
    const list = _get(content, 'data', undefined);
    console.log(list);
    if(list){
        // fetch required fields from json...
       
        dbInstance.write(() => {
            // before store - remove old ones
            const old = dbInstance.objects(Transfer.name).filtered('synced = true');
            if(old)
                dbInstance.delete( old );

            transferResponseToModel(list).forEach(item => {
                dbInstance.create(Transfer.name, item);                
            });
        });
        
    }else{
        console.log( 'the response was unsuccessful' )
    }  
}

export const syncTransfer = async ( dbInstance, data, old_one ) => {
    // fetch from back-end
    const rawResponse = await fetch('http://portal.geosantro.com/api/v1/stock-movement/transfers/store', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...config,
            items: data
        })
    })
    const content = await rawResponse.json();
    
    // if the back-end return us some data,
    // the request was successful
    const list = _get(content, 'data', undefined);
    
    if(list){
        // push new synced value
        dbInstance.write(() => {
            dbInstance.delete(old_one);
            transferResponseToModel(_.values(list)).forEach(item => {
                dbInstance.create(Transfer.name, item);                
            });
        });
        return true;
    } return false;
}

// can be only one instace...
export const instance = async () => {
    return Realm.open({
        schema: [ Product, Transfer, TransferItem ],
        schemaVersion: 2
    });
}