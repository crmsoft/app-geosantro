import React, { Component } from 'react';
import { 
    View,
    Text,
    Image,
    TouchableHighlight,
    ScrollView,
    FlatList,
    AsyncStorage,
    Alert
} from 'react-native';
import {
    ProductListStyle
} from '../../assets/styles/main';
import _ from 'lodash';
import { createStackNavigator } from 'react-navigation';
import Picker from 'react-native-picker';
import { default_image } from '../../assets/img/default-image.json';

class  ProductListItem extends Component{

    promtQuantity( item_id ){
        
    }

    shouldComponentUpdate(nextProps){
        return nextProps.item.id !== this.props.item.id;
    }

    render(){
        const item = this.props.item;
        return(
            <View 
                style={ProductListStyle.wrapper}>
                
                <View 
                    style={ProductListStyle.item}>

                    <View style={{ padding: 5 }}>
                        
                        <Image  
                            source={{
                                uri: item.image.length === 0 ? default_image:item.image
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
                            item.stock && this.promtQuantity( item.id );    
                        }}
                        style={ item.stock <= 0 ? ProductListStyle.itemActionDisabled : ProductListStyle.itemAction}>
                        <Text 
                            style={ProductListStyle.itemActionText}
                        >Add to Transfer</Text>
                    </TouchableHighlight>
                </View>
                
            </View>
        )
    }
}

export default class ProductList extends Component{

    state = {
        data: [],
        abc: [
            0
        ]
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.search !== this.props.search || 
            prevProps.updateFromDbEevent !== this.props.updateFromDbEevent ||
            prevProps.realmInstance !==this.props.realmInstance){
            this.setState({
                data: 
                    this.props.search.length ? 
                    this.props.realmInstance.objects('Product').filtered(`name CONTAINS[c] '${this.props.search}' OR sku CONTAINS[c] '${this.props.search}' OR barcode CONTAINS[c] '${this.props.search}' OR supplier CONTAINS[c] '${this.props.search}'`) :
                    this.props.realmInstance.objects('Product'),
                    abc: [].concat(this.state.abc,[0])
            });
        }
    }

    
    render() {
        console.log(this.state);
        return (
            <View>
                <_ProductList data={this.state.data} />
            </View>
        )
    }
}

class _ProductList extends React.PureComponent {
    state = {selected: new Map()};
  
    _keyExtractor = (item, index) => index;
  
    _onPressItem = (id) => {
      // updater functions are preferred for transactional updates
      this.setState((state) => {
        // copy the map rather than modifying state.
        const selected = new Map(state.selected);
        selected.set(id, !selected.get(id)); // toggle
        return {selected};
      });
    };
  
    _renderItem = ({item}) => (
      <MyListItem
        id={item.id}
        onPressItem={this._onPressItem}
        selected={!!this.state.selected.get(item.id)}
        title={item.title}
      />
    );
  
    renderAnItem(item){
        return <ProductListItem 
            item={item}
            realmInstance={this.props.realmInstance}/>
    }


    render() {
        console.log(this.state);
        return (
                <FlatList
                    extraData={this.state} 
                    keyExtractor={this._keyExtractor}
                    data={this.props.data} 
                    renderItem={ ({item}) => { return this.renderAnItem(item) }} />
        )
    }
  }

