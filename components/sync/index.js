import React, { Component } from "react";
import {
    View,
    ScrollView,
    Text,
    TouchableHighlight,
    AsyncStorage,
    Image,
    Alert
} from 'react-native';
import { SyncStyle } from '../../assets/styles/main';
import DialogAndroid from 'react-native-dialogs';
import { 
    synProducts,
    synTransfers,
    getDate
} from '../models';

import config from '../models/config';

export default class SyncPage extends Component{
    
    state = {
        last_sync_products: '',
        last_sync_transfers: ''
    }

    componentWillMount(){
        const dates = this._getLastSync();
        this.setState({
            last_sync_products: dates.p,
            last_sync_transfers: dates.t
        })
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

        return result;
    }

    _synProducts = () => {
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
                                <Image style={SyncStyle.actionIcon} source={require('../../assets/img/net-connection.png')}/>
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
                                <Image style={SyncStyle.actionIcon} source={require('../../assets/img/net-connection.png')}/>
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
                                Serial No. {config.api_key}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}