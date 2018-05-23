import React, { Component } from 'react';
import { 
    View,
    Text,
    Image,
    TouchableHighlight,
    ScrollView,
    AsyncStorage,
    Alert
} from 'react-native';
import {
    ProductListStyle
} from '../../assets/styles/main';
import _ from 'lodash';
import { createStackNavigator } from 'react-navigation';
import Picker from 'react-native-picker';
export default class ProductList extends Component{

    state = {
        data: []
    }

    promtQunatity( item_id ){
        const target = this.props.realmInstance
                            .objects('Product')
                                .filtered(`id = ${item_id}`);
        if(target){
            const title = target[0].name.length > 19 ? target[0].name.substring(0,20) + `...`:target[0].name;
            const data = `${target[0].stock}`.split('').map( i => {
                return ['',0,1,2,3,4,5,6,7,8,9]
            });
            Picker.init({
                pickerData: data,
                pickerTitleText:  title,  
                pickerTextEllipsisLen: 9,
                pickerConfirmBtnText: 'Add',
                pickerCancelBtnText: 'Cancel',
                pickerConfirmBtnColor: [92,184,92,1],
                pickerCancelBtnColor: [249,104,104,1],
                pickerToolBarBg: [51,51,51,1],
                pickerTitleColor: [255,255,255,1],
                selectedValue: [2],
                onPickerConfirm: async data => {

                    const selectedValue = parseInt(data.reduce((acc,i) => { return acc + i; },''))
                    if(selectedValue > target[0].stock){
                        Alert.alert(
                            'Error',
                            'Selected qunatity is greather than available stock',
                            [
                                { text:'ok' }
                            ]
                        ); return;
                    }

                    data = [`${selectedValue}`];
                    target.selected_quantity = data;
                    try {
                        let value = await AsyncStorage.getItem('@Store:pre_transfer_items')
                            ,already_in = false;
                        
                        if(value === null){
                            value = [] 
                        }else{
                            value = JSON.parse(value);
                        }
                        
                        for(let i = 0; i < value.length; i++){
                            if( item_id === value[i].id ){
                                already_in = i;
                                break;
                            }
                        }
                        if(already_in === false){
                            value.push({
                                id: item_id,
                                quantity: data
                            });
                        }else{
                            value[already_in]['quantity'] = data;
                        }
                        await AsyncStorage.setItem('@Store:pre_transfer_items', JSON.stringify(value));
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
            Picker.show();
        }else{
            console.log(`can not find item with id: ${id}`);
        }
    }

    componentWillMount(){
        if(this.props.realmInstance !== null){
            this.setState({
                data: this.props.realmInstance.objects('Product')
            });
        }
    }

    componentDidUpdate(prevProps, prevState){

        if(prevProps.search !== this.props.search || prevProps.realmInstance !==this.props.realmInstance){
            this.setState({
                data: 
                    this.props.search.length ? 
                    this.props.realmInstance.objects('Product').filtered(`name CONTAINS[c] '${this.props.search}' OR sku CONTAINS[c] '${this.props.search}' OR barcode CONTAINS[c] '${this.props.search}' OR supplier CONTAINS[c] '${this.props.search}'`) :
                    this.props.realmInstance.objects('Product')
            });
        }
    }

    render() {
      return (
            <View>
                <ScrollView>
                {
                    this.state.data.map((item, i) => {
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
                                            <Text>Stock: { item.stock }</Text>
                                        </View>

                                    </View>

                                </View>

                                <View>
                                    <TouchableHighlight 
                                        onPress={ () => {
                                            item.stock && this.promtQunatity( item.id );    
                                        }}
                                        style={ item.stock <= 0 ? ProductListStyle.itemActionDisabled : ProductListStyle.itemAction}>
                                        <Text 
                                            style={ProductListStyle.itemActionText}
                                        >Add to Transfer</Text>
                                    </TouchableHighlight>
                                </View>
                                
                            </View>
                        )
                    })
                }
                </ScrollView>
            </View>
        )
    }
}
