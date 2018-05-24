import React, { Component } from 'react';
import { 
    View,
    Text,
    Image,
    TouchableHighlight,
    ScrollView,
    Picker,
    Button,
    Alert,
    AsyncStorage
} from 'react-native';
import {
    ProductListStyle,
    TranfersStyle
} from '../../assets/styles/main';
import { instance, getDate } from '../models/';

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
        
        let next_id = realm.objects('Transfer').max('id');
        if(next_id === undefined) {next_id = -1}
        ++next_id;

        const transfer = {
            id: next_id,
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
            return{
                id: product.id,
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

    getEmptyListContent(){
        return (
            <View
                style={{flex:1,justifyContent:'center',alignItems:'center'}}
            >
                <View style={{paddingBottom:10}}>
                    <Text>Add some products to create new transfer</Text>
                </View>
                <Button 
                    onPress={ () => { this.props.navigation.goBack(); } }
                    title="Add Products" />
            </View>
        )
    }

    render(){
        return (
            <View style={{flex:1}}>
                { 
                    this.state.items.length ?
                    <View 
                        style={TranfersStyle.listWrapper}
                    >
                        <ScrollView >
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
                                                        numberOfLines={1}
                                                        style={ProductListStyle.itemTitle}>{ item.name }</Text>
                                                </View>

                                                <View>
                                                    <Text>{ item.supplier }</Text>
                                                </View>

                                                <View>
                                                    <Text numberOfLines={1}>SKU: { item.sku } / Barcode: { item.barcode }</Text>
                                                </View>

                                                <View>
                                                    <Text numberOfLines={1}>Stock: { item.stock }</Text>
                                                </View>

                                                <View style={TranfersStyle.pickerWrapper}>
                                                    <Picker
                                                        prompt={ `Qunatity: ${item.name}` }
                                                        selectedValue={~~item.selected_quantity[0]}
                                                        onValueChange={(itemValue) => this.changeQuantity(item.id,itemValue)}>
                                                        
                                                        {
                                                            Array.apply(null, Array(~~item.stock)).map(function (a,i) {
                                                                const index = ++i;
                                                                return <Picker.Item label={`${index}`} value={index} key={`option_${index}`} />
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
                        </ScrollView> 
                        <View style={TranfersStyle.requestTransferWrapper}>
                            <Button 
                                onPress={ () => this.createTransfer() }
                                style={TranfersStyle.requestTransferButton} 
                                title="Request Transfer" />
                        </View>
                    </View> : this.getEmptyListContent()
                }
            </View>
        )
    }
}