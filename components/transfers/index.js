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

export default class Transfers extends Component{

    state = {
        data: []
    }

    _removeUnsyncedTransfer( transfer_id ){
        if(this.props.realmInstance !== null){
            console.log(transfer_id);
            this.props.realmInstance.write(() => {
                const to_delete = this.props.realmInstance
                                    .objects('Transfer')
                                    .filtered(`id = ${transfer_id}`);
                if(to_delete){
                    this.props.realmInstance.delete(to_delete)
                    this.setState({
                        data: this.props.realmInstance.objects('Transfer')
                    });
                }
            })
        }
    }

    componentWillMount(){
        if(this.props.realmInstance !== null){
            this.setState({
                data: this.props.realmInstance.objects('Transfer')
            });
        }
    }

    componentDidUpdate(prevProps, prevState){

        if(prevProps.realmInstance !==this.props.realmInstance){
            this.setState({
                data: this.props.realmInstance.objects('Transfer')
            });
        }
    }

    render(){
        return (
            <ScrollView>
                {
                    _.values(this.state.data).map( transfer => {
                        console.log(transfer.products);
                        const totalItems = _.values(transfer.products).reduce( (acc, val) => {
                            return acc.item_quantity + val.item_quantity;
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
                                    <View 
                                        style={TranfersStyle.actionReorder}>
                                        <Image 
                                            style={TranfersStyle.statusIcon} 
                                            source={require('../../assets/img/re-order.jpg')}/>
                                        <Text>  </Text>
                                        <Text 
                                            style={TranfersStyle.actionText}>Reorder</Text>
                                    </View>
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
                                        <View 
                                            style={TranfersStyle.actionReorder}>
                                            <Image 
                                                style={TranfersStyle.statusIcon} 
                                                source={require('../../assets/img/re-order.jpg')}/>
                                            <Text>  </Text>
                                            <Text 
                                                style={TranfersStyle.actionText}>Reorder</Text>
                                        </View>
                                        <View style={TranfersStyle.actionSync}>
                                            <Image 
                                                style={TranfersStyle.statusIcon} 
                                                source={require('../../assets/img/net-connection.png')}/>
                                            <Text>  </Text>
                                            <Text 
                                                style={TranfersStyle.actionText}>Sync</Text>
                                        </View> 
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