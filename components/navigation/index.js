import React from 'react';
import { 
    Text,
    TouchableHighlight ,
    View, 
    Image,
    TextInput 
} from 'react-native';
import Swiper from 'react-native-swiper';
import { 
    PagesWrapperStyle
} from '../../assets/styles/main';
import NavigationPagination from './pagination';
import ProductList from '../products';
import SyncPage from '../sync';
import Transfers from '../transfers';
import {
    instance
} from '../models/index';

const pages = [
    ProductList,
    Transfers,
    SyncPage    
]

export default class Nav extends React.Component{

    state = {
        instance: null
    }

    componentWillMount(){
        instance()
        .then( realm => {
            this.setState({
                instance: realm
            })
        })
    }

    render(){
        return (
            <Swiper 
                style={PagesWrapperStyle.wrapper} 
                showsPagination={true}
                renderPagination={NavigationPagination}
                showsButtons={false}
                loop={false}
            >

            {
                pages.map( (Page, i) => {
                    return (
                        <View key={i} style={PagesWrapperStyle.page}>
                            <Page realmInstance={this.state.instance} search={this.props.searchTerm} />
                        </View>
                    )
                })
            }

            </Swiper>
        )
    }
}