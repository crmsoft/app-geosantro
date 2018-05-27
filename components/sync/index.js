import React, { Component } from "react";
import {
    View,
    ScrollView,
    Text,
    TouchableHighlight,
    ActivityIndicator,
    AsyncStorage,
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
        inet: networkStore.getState(),
        productsSyncronizationInProgress: false,
        transfersSyncronizationInProgress: false
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

    _synProducts = async () => {
        
        // avoid press if we already syncing... 
        if(this.state.productsSyncronizationInProgress){
            return;
        }

        if(this.state.inet === STATE_OFFLINE){
            alertNoConnection();
            return;
        } 

        this.setState({
            productsSyncronizationInProgress: true
        }, () => {
            synProducts(this.props.realmInstance)
            .then(() => {
                (async () => {
                    try{
                        const s_date = getDate();
                        await AsyncStorage.setItem('@Store:sync_p', s_date)
                        this.setState({
                            last_sync_products: s_date,
                            productsSyncronizationInProgress: false
                        })
                    }catch(err){
                        console.log(err);
                        this.setState({
                            productsSyncronizationInProgress: false
                        })
                    }
                })()
            })
            .catch( err => {
                Alert.alert(
                    'Error',
                    err,
                    [
                        { text:'ok' }
                    ]
                );
                this.setState({
                    productsSyncronizationInProgress: false
                })
            })
        })
    }

    _synTransfers = async () => {
        
        // avoid press if we already syncing... 
        if(this.state.transfersSyncronizationInProgress){
            return;
        }

        if(this.state.inet === STATE_OFFLINE){
            alertNoConnection();
            return;
        } 

        this.setState({
            transfersSyncronizationInProgress: true 
        },() => {
            synTransfers(this.props.realmInstance)
            .then(() => {
                (async () => {
                    try{
                        const s_date = getDate();
                        await AsyncStorage.setItem('@Store:sync_t', s_date)
                        this.setState({
                            last_sync_transfers: s_date,
                            transfersSyncronizationInProgress: false
                        })
                    }catch(err){
                        console.log(err);
                        this.setState({
                            transfersSyncronizationInProgress: false
                        })
                    }
                })()
            })
            .catch(err => {
                Alert.alert(
                    'Error',
                    err,
                    [
                        {text:'ok'}
                    ]
                );
                this.setState({
                    transfersSyncronizationInProgress: false
                })
            })
        });
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
                                {
                                    this.state.productsSyncronizationInProgress ? 
                                    <ActivityIndicator size="small" color="#00ff00" /> :
                                    <Icon name="wifi" size={25} style={TranfersStyle.reorderIcon} />
                                }
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
                                {
                                    this.state.transfersSyncronizationInProgress ? 
                                    <ActivityIndicator size="small" color="#00ff00" /> :
                                    <Icon name="wifi" size={25} style={TranfersStyle.reorderIcon} />
                                }
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