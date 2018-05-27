import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import TransferItem from './item';

export default class Transfers extends Component{

    state = {
        data: [],
    }

    _getList(){
        if(this.props.realmInstance !== null){
            return this.props.realmInstance
                        .objects('Transfer').sorted('created_at',true)
        } return {};
    }

    componentWillMount(){
        if(this.props.realmInstance !== null){
            this.setState({
                data: this._getList()
            });
        } 
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.realmInstance !==this.props.realmInstance){
            this.setState({
                data: this._getList()
            });
        }
    }

    _renderAnItem(item,realmInstance,r){
        return <TransferItem
                    rerender={r}
                    realmInstance={realmInstance} 
                    transfer={item} />;
    }

    _forceReRender(){
        this.forceUpdate();
    }

    _rerender = 0
    render(){
        ++this._rerender;
        return (
            <FlatList 
                extraData={this._rerender}
                keyExtractor={(item, index) => `${index}`}
                renderItem={ ({item}) => this._renderAnItem(item,this.props.realmInstance,this._forceReRender.bind(this))}
                data={this.state.data}
            />
        );
    }
}

