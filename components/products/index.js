import React, { Component } from 'react';
import { 
    View,
    Text,
    Image,
    TouchableHighlight,
    ScrollView,
    Picker,
    Button,
    Alert
} from 'react-native';
import {
    ProductListStyle
} from '../../assets/styles/main';
import DialogAndroid from 'react-native-dialogs';
import { data } from './list.json';
import _ from 'lodash';
import { createStackNavigator } from 'react-navigation';

export default class ProductList extends Component{

    state = {
        data: []
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
                                            this.popupDialog.show();    
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
