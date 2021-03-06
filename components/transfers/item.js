import React, {Component} from 'react';
import {
    Text,
    FlatList,
    View,
    TouchableHighlight
} from 'react-native';
import {
    STATE_OFFLINE,
    STATE_ONLINE,
    alertNoConnection,
    networkStore
} from '../sync/net-listener';
import { TranfersStyle } from '../../assets/styles/main';
import _ from 'lodash';
import { getDate, syncTransfer } from '../models';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class TransferItem extends Component{

    state = {
        inet: networkStore.getState()
    }

    componentWillMount(){
        networkStore.subscribe(state => {
            this.setState({
                inet: networkStore.getState()
            });
        });
    }

    _getList(){
        if(this.props.realmInstance !== null){
            return this.props.realmInstance
                        .objects('Transfer').sorted('created_at',true)
        } return {};
    }

    _statusText( {synced,updated_at} ){
        return (
            synced ? (
                <View style={TranfersStyle.statusContent}>
                    <Icon name="wifi" size={20} style={TranfersStyle.statusIcon} />
                    <Text>   </Text>
                    <Text style={TranfersStyle.statusSuccessText}>Synced</Text>
                    <Text style={TranfersStyle.syncDate}>{updated_at}</Text>
                </View>
            ):(
                <View style={TranfersStyle.statusContent}>
                    <Icon name="warning" size={20} style={TranfersStyle.statusNotSyncedIcon} />
                    <Text>   </Text>
                    <Text style={TranfersStyle.statusErrorText}>Not Synced</Text>
                </View>
            )
        );
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
                    //this.props.rerender();
                })
            }
        }
    }

    _syncTransfer( transfer_id ){
        if(this.state.inet === STATE_OFFLINE){
            alertNoConnection();
            return;
        }
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

    _actionButtons({synced,id}){
        return (
            synced ? (
                <View style={TranfersStyle.actionsWrapper}>
                    <TouchableHighlight
                        style={{flex:1,alignContent:'center',justifyContent:'center'}}
                        onPress={ () => this._reorderTransfer(id)}
                    >
                        <View 
                            style={TranfersStyle.actionReorder}>
                            <Icon name="cached" size={20} style={TranfersStyle.reorderIcon} />
                            <Text>  </Text>
                            <Text 
                                style={TranfersStyle.actionText}>Reorder</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            ):(
                <View style={TranfersStyle.actionsWrapper}>
                    <TouchableHighlight
                        style={{flex:1,alignContent:'center',justifyContent:'center'}}
                        onPress={ () => this._reorderTransfer(id) }
                    >
                        <View 
                            style={TranfersStyle.actionReorder}>
                            <Icon name="cached" size={20} style={TranfersStyle.reorderIcon} />
                            <Text>  </Text>
                            <Text 
                                style={TranfersStyle.actionText}>Reorder</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={{flex:1,alignContent:'center',justifyContent:'center'}}
                        onPress={ () => this._syncTransfer(id) }
                    >
                        <View style={TranfersStyle.actionSync}>
                            <Icon name="wifi" size={20} style={TranfersStyle.reorderIcon} />
                            <Text>  </Text>
                            <Text 
                                style={TranfersStyle.actionText}>Sync</Text>
                        </View> 
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={{flex:1,alignContent:'center',justifyContent:'center'}}
                        onPress={ () => this._removeUnsyncedTransfer(id) }
                    >
                        <View style={TranfersStyle.actionDelete}>
                            <Icon name="delete-forever" size={20} style={TranfersStyle.reorderIcon} />
                            <Text>  </Text>
                            <Text 
                                style={TranfersStyle.actionText}>Delete</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            )
        )
    }

    render(){
        const transfer = this.props.transfer;
        const totalItems = _.values(transfer.products).reduce( (acc, val) => {
            return acc + val.item_quantity;
        },0);
        return (
            <View key={transfer.id} style={TranfersStyle.wrapper}>
                
                <View>
                    <View>
                        <Text style={TranfersStyle.addDate}>Added on {transfer.created_at}</Text>
                    </View>
                    <View>
                        <Text>Items: {totalItems}</Text>
                    </View>
                </View>

                <View style={TranfersStyle.statusWrapper}>
                    { this._statusText(transfer) }
                </View>

                {this._actionButtons(transfer)}

            </View>
        );
    }
}