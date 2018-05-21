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
import DialogAndroid from 'react-native-dialogs';
import { data } from './list.json';
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
            
            const data = Array.apply(null, Array(~~target[0].stock)).map(function (a,i) {
                return  i;
            });

            Picker.init({
                pickerData: data,
                pickerTitleText: target[0].name,  
                selectedValue: [2],
                onPickerConfirm: async data => {
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
                        if(!already_in){
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
                    this.props.realmInstance.objects('Product').filtered(`name CONTAINS[c] '${this.props.search}'`) :
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
                                                style={ProductListStyle.itemTitle}>{ item.name }</Text>
                                        </View>

                                        <View>
                                            <Text>{ item.supplier }</Text>
                                        </View>

                                        <View>
                                            <Text>{ item.sku } / { item.barcode }</Text>
                                        </View>

                                        <View>
                                            <Text>{ item.stock }</Text>
                                        </View>

                                    </View>

                                </View>

                                <View>
                                    <TouchableHighlight 
                                        onPress={ () => {
                                            this.promtQunatity( item.id );    
                                        }}
                                        style={ProductListStyle.itemAction}>
                                        <Text 
                                            style={ProductListStyle.itemActionText}>Add to Transfer</Text>
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
