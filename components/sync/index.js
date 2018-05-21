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
    synTransfers
} from '../models';

export default class SyncPage extends Component{
    
    _synProducts = () => {
        synProducts(this.props.realmInstance);
    }

    _synTransfers = () => {
        synTransfers(this.props.realmInstance);
    }

    render(){
        return (
            <ScrollView>
                <View style={SyncStyle.wrapper}>
                    <View>
                        <Text style={SyncStyle.title}>Sync Products</Text>
                    </View>
                    <View>
                        <Text>Last synced dd/mm/Y H:i:s</Text>
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
                        <Text>Last synced dd/mm/Y H:i:s</Text>
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
                                Serial No. #######
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}