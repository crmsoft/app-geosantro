import React, { Component } from 'react';
import { 
    View,
    Text,
    Image,
    TouchableHighlight,
    ScrollView,
    Picker,
    Alert
} from 'react-native';
import {
    ProductListStyle,
    TranfersStyle
} from '../../assets/styles/main';
import { default_image } from '../../assets/img/default-image.json';
import { data } from '../products/list.json';
import _ from 'lodash';

const getImage = ( from ) => {
    let img = _.get(from,'attributes.image', undefined);
    return img ? `data:image/png;base64,${img}` : default_image;
}

export default class ProductList extends Component{

    static navigationOptions =
    {
       title: 'Transfer',
    };

    render(){
        return (
            <View style={TranfersStyle.listWrapper}>
                <ScrollView>
                {
                    data.map((item, i) => {
                        const productName = _.get(item,'attributes.name');
                        return (
                            <View 
                                key={i} 
                                style={ProductListStyle.wrapper}>
                                
                                <View 
                                    style={ProductListStyle.item}>

                                    <View style={{ padding: 5 }}>
                                        
                                        <Image  
                                            source={{
                                                uri: getImage(item)
                                            }}
                                            style={ProductListStyle.image}/>
                                    </View>

                                    <View 
                                        style={ProductListStyle.infoWrapper}>
                                        
                                        <View>
                                            <Text 
                                                style={ProductListStyle.itemTitle}>{ productName }</Text>
                                        </View>

                                        <View>
                                            <Text>{ _.get(item,'relationships.supplier.attributes.first_name','-') }</Text>
                                        </View>

                                        <View>
                                            <Text>{ _.get(item,'attributes.sku') } / { _.get(item,'attributes.barcode') }</Text>
                                        </View>

                                        <View style={TranfersStyle.pickerWrapper}>
                                            <Picker
                                                prompt={ `Qunatity: ${productName}` }
                                                onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
                                                
                                                {
                                                    Array.apply(null, Array(185)).map(function (a,i) {
                                                        return <Picker.Item label={`${i}`} value={i} />
                                                    })
                                                }
                                            </Picker>
                                        </View>

                                    </View>

                                </View>

                                <View>
                                    <TouchableHighlight 
                                        onPress={ () => {
                                            
                                        }}
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
                    <TouchableHighlight>
                        <Text style={TranfersStyle.requestTransferText}>Request Transfer</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}