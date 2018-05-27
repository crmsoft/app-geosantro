import Realm from 'realm';
import {
    Product,
    Transfer, 
    TransferItem
} from './schmeas';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';

const API_REJECT = 'Please syncronize your serial number with back office.';
const NET_FAIL = 'Syncronization failed, check your iternet connection and try again later.';
const UNKNOW_ERROR = 'Some unexpected error was accourred.';
// api credentials
const config = {
    'api_key':DeviceInfo.getUniqueID()
}
// image in base64
const img_prefix = 'data:image/png;base64,';

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
                    id: ~~_get(product,'attributes.product_id',0),
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

/**
 * API Product list request 
 * and fill db with retrieved data
 * @param dbInstance 
 */
export const synProducts = (dbInstance) => {
    return new Promise((resolve,reject) => {
        fetch('https://portal.geosantro.com/api/v1/stock-movement/products', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        })
        .then(raw => raw.json())
        .then(json => {
            const list = _get(json, 'data', undefined);
            if(!list){
                return reject(API_REJECT);
            }
            // use helper to insert data to db...
            this._synProducts(list,dbInstance)
            .then(resolved => resolve())
            .catch(err => reject(err));
        })
        .catch(err => reject(NET_FAIL))
    });
}

/**
 * process the server response
 * from product list api request
 * and fill db with new fresh data
 * @param list
 * @param dbInstance
 */
_synProducts = ( list, dbInstance ) => {
    return new Promise((resolve,reject) => {
        try{
            var data = list.map((product) => {
                const first_name = _get(product,'relationships.supplier.attributes.first_name','-');
                const last_name = _get(product,'relationships.supplier.attributes.last_name','');
                const img = _get(product,'attributes.image', '');
                return  {
                    id: ~~product.id,
                    name: _get(product,'attributes.name','-'),
                    sku: _get(product,'attributes.sku','-'),
                    stock: _get(product,'attributes.stock','-'),
                    image: img.length > 0 ? `${img_prefix}${img}`:``,
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
                // the synconization is successeded and finalized.
                resolve('done');
            });  
        }catch(err){
            console.log(err);
            reject(UNKNOW_ERROR)
        }
    }); 
}

/**
 * API request to load transfer list
 * @param {Realm} dbInstance 
 */
export const synTransfers = (dbInstance) => {
    return new Promise((resolve,reject) => {
        fetch('https://portal.geosantro.com/api/v1/stock-movement/transfers', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        })
        .then(raw => raw.json())
        .then(json => {
            const list = _get(json, 'data', undefined);
            if(!list){
                return reject(API_REJECT);
            }
            this._synTransfers(list,dbInstance)
            .then(resolved => resolve())
            .catch(err => reject(err))
        })
        .catch(err => reject(NET_FAIL))
    });
}

/**
 * write to db retrieved data
 * @param list 
 * @param dbInstance
 */
_synTransfers = ( list, dbInstance ) => {
    return new Promise((resolve,reject) => {
        try{
            dbInstance.write(() => {
                // before store - remove old ones
                const old = dbInstance.objects(Transfer.name).filtered('synced = true');
                if(old)
                    dbInstance.delete( old );
        
                transferResponseToModel(list).forEach(item => {
                    dbInstance.create(Transfer.name, item);                
                });
                resolve('done');
            });
        }catch(err){
            console.log(err);
            reject(UNKNOW_ERROR)
        }
    })
}

/**
 * push to API new Transfer
 * @param {Realm} dbInstance 
 * @param {Transfer} data 
 * @param {Transfer} old_one 
 */
export const syncTransfer = async ( dbInstance, data, old_one ) => {
    console.log('syncTransfer')
    // fetch from back-end
    const rawResponse = await fetch('https://portal.geosantro.com/api/v1/stock-movement/transfers/store', {
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
    // if the back-end return us some data,
    // the request was successful
    const content = await rawResponse.json();
    const list = _get(content, 'data', undefined);

    if(list){
        // push new synced value
        dbInstance.write(() => {
            const vals = transferResponseToModel([list]);
            console.log(vals);
            vals.forEach(item => {
                dbInstance.create(Transfer.name, item);                
            });
            dbInstance.delete(old_one);
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