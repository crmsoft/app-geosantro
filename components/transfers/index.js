import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import { TranfersStyle } from '../../assets/styles/main';
import _ from 'lodash';
import { getDate, syncTransfer } from '../models';

export default class Transfers extends Component{

    state = {
        data: []
    }

    _getList(){
        if(this.props.realmInstance !== null){
            return this.props.realmInstance
                        .objects('Transfer').sorted('created_at',true)
        } return {};
    }

    _removeUnsyncedTransfer( transfer_id ){
        if(this.props.realmInstance !== null){
            this.props.realmInstance.write(() => {
                const to_delete = this.props.realmInstance
                                    .objects('Transfer')
                                    .filtered(`id = ${transfer_id}`);
                if(to_delete){
                    this.props.realmInstance.delete(to_delete)
                }
            });
        }
    }

    _reorderTransfer( transfer_id ){
        if(this.props.realmInstance !== null){
            const items = this._getList();
            const duplicate = items.filtered(`id=${transfer_id}`);
            if(duplicate[0]){
                const next_id = items.max('id') + 1;
                this.props.realmInstance.write(() => {
                    this.props.realmInstance.create('Transfer',{
                        ...duplicate[0],
                        synced: false,
                        id: next_id,
                        created_at: getDate()
                    });
                })
            }
        }
    }

    _syncTransfer( transfer_id ){
        const to_by_synced = this._getList().filtered(`id=${transfer_id} AND synced=false`);
        if(to_by_synced[0]){
            syncTransfer(
                this.props.realmInstance,
                _.values(to_by_synced[0].products).map(product => {
                    return {
                        product_id:product.id,
                        quantity: product.item_quantity
                    }
                }),
                to_by_synced
            ).then(result => {
                
            })            
        }
    }

    componentWillMount(){
        if(this.props.realmInstance !== null){
            this.setState({
                data: this._getList()
            });
        }
    }

    componentDidUpdate(prevProps, prevState){
        console.log('componentDidUpdate');
        if(prevProps.realmInstance !==this.props.realmInstance){
            this.props.realmInstance.removeAllListeners();
            this.props.realmInstance.addListener('change', () => {
                this.setState({
                    data: this._getList()
                });
                console.log('update the state');
            });
            this.setState({
                data: this._getList()
            });
        }
    }

    render(){
        return (
            <ScrollView>
                {
                    _.values(this.state.data).map( transfer => {
                        const totalItems = _.values(transfer.products).reduce( (acc, val) => {
                            return acc + val.item_quantity;
                        },0);
                        return (
                            transfer.synced ? (
                            <View key={transfer.id} style={TranfersStyle.wrapper}>
                                <View>
                                    <View>
                                        <Text style={TranfersStyle.addDate}>Added on {transfer.created_at}</Text>
                                    </View>
                                    <View>
                                        <Text># {totalItems}</Text>
                                    </View>
                                </View>
                                <View style={TranfersStyle.statusWrapper}>
                                    <View style={TranfersStyle.statusContent}>
                                        <Image 
                                            style={TranfersStyle.statusIcon} 
                                            source={require('../../assets/img/sync-success.png')}/>
                                        <Text>   </Text>
                                        <Text style={TranfersStyle.statusSuccessText}>Synced</Text>
                                        <Text style={TranfersStyle.syncDate}>{transfer.updated_at}</Text>
                                    </View>
                                </View>
                                
                                <View 
                                    style={TranfersStyle.actionsWrapper}>
                                    <TouchableHighlight
                                        style={{flex:1,alignContent:'center',justifyContent:'center'}}
                                        onPress={ () => this._reorderTransfer(transfer.id)}
                                    >
                                        <View 
                                            style={TranfersStyle.actionReorder}>
                                            <Image 
                                                style={TranfersStyle.statusIcon} 
                                                source={require('../../assets/img/re-order.jpg')}/>
                                            <Text>  </Text>
                                            <Text 
                                                style={TranfersStyle.actionText}>Reorder</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </View>
                            ) : (
                                <View key={transfer.id} style={TranfersStyle.wrapper}>
                                    <View>
                                        <View>
                                            <Text style={TranfersStyle.addDate}>Added on {transfer.created_at}</Text>
                                        </View>
                                        <View>
                                            <Text># {totalItems}</Text>
                                        </View>
                                    </View>
                                    <View style={TranfersStyle.statusWrapper}>
                                        <View style={TranfersStyle.statusContent}>
                                            <Image style={TranfersStyle.statusIcon} source={require('../../assets/img/no-sync.png')}/>
                                            <Text>   </Text>
                                            <Text style={TranfersStyle.statusErrorText}>Not Synced</Text>
                                        </View>
                                    </View>
                                    <View 
                                        style={TranfersStyle.actionsWrapper}>
                                        <TouchableHighlight
                                            style={{flex:1,alignContent:'center',justifyContent:'center'}}
                                            onPress={ () => this._reorderTransfer(transfer.id) }
                                        >
                                            <View 
                                                style={TranfersStyle.actionReorder}>
                                                <Image 
                                                    style={TranfersStyle.statusIcon} 
                                                    source={require('../../assets/img/re-order.jpg')}/>
                                                <Text>  </Text>
                                                <Text 
                                                    style={TranfersStyle.actionText}>Reorder</Text>
                                            </View>
                                        </TouchableHighlight>
                                        <TouchableHighlight
                                            style={{flex:1,alignContent:'center',justifyContent:'center'}}
                                            onPress={ () => this._syncTransfer(transfer.id) }
                                        >
                                            <View style={TranfersStyle.actionSync}>
                                                <Image 
                                                    style={TranfersStyle.statusIcon} 
                                                    source={require('../../assets/img/net-connection.png')}/>
                                                <Text>  </Text>
                                                <Text 
                                                    style={TranfersStyle.actionText}>Sync</Text>
                                            </View> 
                                        </TouchableHighlight>
                                        <TouchableHighlight
                                            style={{flex:1,alignContent:'center',justifyContent:'center'}}
                                            onPress={ () => this._removeUnsyncedTransfer(transfer.id) }
                                        >
                                            <View style={TranfersStyle.actionDelete}>
                                                <Image 
                                                    style={TranfersStyle.statusIcon} 
                                                    source={require('../../assets/img/delete.jpg')}/>
                                                <Text>  </Text>
                                                <Text 
                                                    style={TranfersStyle.actionText}>Delete</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            )
                        );
                    })
                }
                
            </ScrollView>
        );
    }
}