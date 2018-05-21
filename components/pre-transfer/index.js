import React, { Component } from 'react';
import { 
    View,
    Text,
    Image,
    TouchableHighlight,
    ScrollView,
    Picker,
    Alert,
    AsyncStorage
} from 'react-native';
import {
    ProductListStyle,
    TranfersStyle
} from '../../assets/styles/main';
import { instance } from '../models/';

// date in format : D/MM/Y h:mm
const getDate = () => {

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

export default class ProductList extends Component{

    static navigationOptions =
    {
       title: 'Transfer',
    };

    state = {
        items: []
    }

    componentWillMount(){
        this.loadItems()
    }

    loadItems = async () => {
        try{

            let items = await AsyncStorage.getItem('@Store:pre_transfer_items');
            if(items === null)
                return;
        
            const realm = await instance()
            
            const products = JSON.parse(items).map((candidate) => {
                let p = realm.objects('Product')
                    .filtered(`id = ${candidate.id}`);
                
                return {
                    ...p[0],
                    selected_quantity: candidate.quantity
                };
            });

            this.setState({
                items: products
            });
        }catch(err){
            console.log( err );
        }
    }

    removeFromList = async (id) => {
        try{
            let items = await AsyncStorage.getItem('@Store:pre_transfer_items');
            if(items !== null){
                const new_items = JSON.parse(items).filter( item => {
                    return item.id !== id
                });
                console.log(new_items);
                await AsyncStorage.setItem('@Store:pre_transfer_items', JSON.stringify(new_items));
                await this.loadItems();
            }
        }catch(err){
            console.log(err);
        }
    }

    changeQuantity = async (id, new_quantity) => {
        try{
            let items = await AsyncStorage.getItem('@Store:pre_transfer_items');
            if(items !== null){
                const new_items = JSON.parse(items).map( item => {
                    if(item.id === id){
                        item.quantity = [new_quantity];
                    } return item;
                });
                await AsyncStorage.setItem('@Store:pre_transfer_items', JSON.stringify(new_items));
                await this.loadItems();
            }
        }catch(err){
            console.log(err);
        }
    }

    createTransfer = async () => {
        const realm = await instance();

        const creation_date = getDate();

        const transfer = {
            id: 1,
            user_id:1,
            user_name: 'product.user_name',
            user_email: 'product.user_email',
            status: 'pending',
            created_at: creation_date,
            updated_at: creation_date,
            synced: false,
            products: []
        };

        transfer.products = this.state.items.map( product => {
            console.log(product);
            return{
                id: 11,
                transfer_id: 1,
                product_id: product.id,
                item_name: product.name,
                item_sku: product.sku,
                item_barcode: product.barcode,
                item_price: 0,
                item_quantity: ~~product.selected_quantity.pop(),
                item_new_quantity: 0,
                item_comments: '',
                for_delete: 0,
                created_at: creation_date,
                updated_at: creation_date
            }
        })

        realm.write( async () => {
            realm.create('Transfer', transfer);
            await AsyncStorage.setItem('@Store:pre_transfer_items', JSON.stringify([]));
            this.setState({
                items: []
            }) 
        });
    }

    render(){
        return (
            <View style={TranfersStyle.listWrapper}>
                { this.state.items.length ?
                    <ScrollView>
                    {
                        this.state.items.map((item, i) => {
                            return (
                                <View 
                                    key={i} 
                                    style={ProductListStyle.wrapper}>
                                    
                                    <View 
                                        style={ProductListStyle.item}>

                                        <View style={{ padding: 5 }}>
                                            
                                            <Image  
                                                source={{
                                                    uri: item.image
                                                }}
                                                style={ProductListStyle.image}/>
                                        </View>

                                        <View 
                                            style={ProductListStyle.infoWrapper}>
                                            
                                            <View>
                                                <Text 
                                                    style={ProductListStyle.itemTitle}>{ item.name }</Text>
                                            </View>

                                            <View>
                                                <Text>{ item.supplier }</Text>
                                            </View>

                                            <View>
                                                <Text>{ item.sku } / { item.barcode }</Text>
                                            </View>

                                            <View style={TranfersStyle.pickerWrapper}>
                                                <Picker
                                                    prompt={ `Qunatity: ${item.name}` }
                                                    selectedValue={~~item.selected_quantity.pop()}
                                                    onValueChange={(itemValue) => this.changeQuantity(item.id,itemValue)}>
                                                    
                                                    {
                                                        Array.apply(null, Array(~~item.stock)).map(function (a,i) {
                                                            return <Picker.Item label={`${i}`} value={i+1} key={`option_${i}`} />
                                                        })
                                                    }
                                                </Picker>
                                            </View>

                                        </View>

                                    </View>

                                    <View>
                                        <TouchableHighlight 
                                            onPress={ () => this.removeFromList(item.id) }
                                            style={TranfersStyle.actonRemove}>
                                            <Text 
                                                style={ProductListStyle.itemActionText}>Remove</Text>
                                        </TouchableHighlight>
                                    </View>
                                    
                                </View>
                            )
                        })
                    }
                    </ScrollView> : (<View><Text>Empty</Text></View>)
                }
                <View style={TranfersStyle.requestTransferWrapper}>
                    <TouchableHighlight
                        style={{ flex:1 }}
                        onPress={ () => this.createTransfer() }>
                        <Text style={TranfersStyle.requestTransferText}>Request Transfer</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}