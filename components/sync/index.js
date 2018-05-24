import React, { Component } from "react";
import {
    View,
    ScrollView,
    Text,
    TouchableHighlight,
    AsyncStorage,
    NetInfo,
    Image,
    Alert
} from 'react-native';
import { SyncStyle, TranfersStyle } from '../../assets/styles/main';
import DialogAndroid from 'react-native-dialogs';
import { 
    synProducts,
    synTransfers,
    getDate
} from '../models';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
    STATE_OFFLINE,
    STATE_ONLINE,
    alertNoConnection,
    networkStore
} from './net-listener';

export default class SyncPage extends Component{
    
    state = {
        last_sync_products: '',
        last_sync_transfers: '',
        inet: networkStore.getState()
    }

    componentWillMount(){
        this._getLastSync();
        networkStore.subscribe(state => {
            this.setState({
                inet: networkStore.getState()
            });
        }); 
    }

    _getLastSync = async () => {
        
        const result = {
            p: '--/--/-- --:--',
            t: '--/--/-- --:--'
        };

        try{
            const last_sync_p = await AsyncStorage.getItem('@Store:sync_p');
            const last_sync_t = await AsyncStorage.getItem('@Store:sync_t');

            if(last_sync_p !== null){
                result.p = last_sync_p;
            }

            if(last_sync_t !== null){
                result.t = last_sync_t;
            }

        }catch(err){
            console.log(err);
        }
        
        this.setState({
            last_sync_products: result.p,
            last_sync_transfers: result.t
        })
    }

    _synProducts = () => {
        
        if(this.state.inet === STATE_OFFLINE){
            alertNoConnection();
            return;
        } 

        synProducts(this.props.realmInstance);
        (async () => {
            try{
                const s_date = getDate();
                await AsyncStorage.setItem('@Store:sync_p', s_date)
                this.setState({
                    last_sync_products: s_date
                })
            }catch(err){
                console.log(err);
            }
        })()
    }

    _synTransfers = () => {
        
        if(this.state.inet === STATE_OFFLINE){
            alertNoConnection();
            return;
        } 

        synTransfers(this.props.realmInstance);
        (async () => {
            try{
                const s_date = getDate();
                await AsyncStorage.setItem('@Store:sync_t', s_date)
                this.setState({
                    last_sync_transfers: s_date
                })
            }catch(err){
                console.log(err);
            }
        })()
    }

    render(){
        return (
            <ScrollView>
                <View style={SyncStyle.wrapper}>
                    <View>
                        <Text style={SyncStyle.title}>Sync Products</Text>
                    </View>
                    <View>
                        <Text>Last synced {this.state.last_sync_products}</Text>
                    </View>
                    <View style={SyncStyle.actionWrapper}>
                        <TouchableHighlight 
                            onPress={ this._synProducts }
                            style={SyncStyle.actionInner}>
                            <View style={SyncStyle.actionContent}>
                                <Icon name="wifi" size={25} style={TranfersStyle.reorderIcon} />
                                <Text>   </Text>
                                <Text style={SyncStyle.actionText}>Synchronize</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={SyncStyle.wrapper}>
                    <View>
                        <Text style={SyncStyle.title}>Sync Transfers</Text>
                    </View>
                    <View>
                        <Text>Last synced {this.state.last_sync_transfers}</Text>
                    </View>
                    <View style={SyncStyle.actionWrapper}>
                        <TouchableHighlight 
                            onPress={ this._synTransfers }
                            style={SyncStyle.actionInner}>
                            <View style={SyncStyle.actionContent}>
                                <Icon name="wifi" size={25} style={TranfersStyle.reorderIcon} />
                                <Text>   </Text>
                                <Text style={SyncStyle.actionText}>Synchronize</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <View style={SyncStyle.wrapper}>
                    <View style={SyncStyle.hintWrapper}>
                        <Text>
                            In order for the synchronization to be successful, the device must be connected to the itnernet.
                        </Text>
                        <View style={SyncStyle.hintSub}>
                            <Text>
                                Serial No. {DeviceInfo.getUniqueID().toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}