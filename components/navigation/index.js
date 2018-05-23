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

    activeIndex = 0;

    state = {
        instance: null,
    };
    
    componentWillMount(){
        instance()
        .then( realm => {
            this.setState({
                instance: realm
            });
            realm.addListener('change', this.updateUi.bind(this));
        })
    }

    componentWillUnmount(){
        this.state.instance.removeListener('change',this.updateUi);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.showProductsTab){
            this.activeIndex = 0;
            this.forceUpdate();
        }
    }

    updateUi(){
        this.forceUpdate();
    }

    render(){
        return (
            <Swiper 
                onIndexChanged={ index => {
                    this.activeIndex = index;
                }}
                style={PagesWrapperStyle.wrapper} 
                showsPagination={true}
                renderPagination={ (index,total,context) => {
                    return <NavigationPagination 
                                index={index} 
                                total={total} 
                                context={context} />
                }}
                showsButtons={false}
                loop={false}
            >

            {
                pages.map( (Page, i) => {
                    return (
                        <View key={i} style={PagesWrapperStyle.page}>
                            <Page 
                                onHeaderPress={ index => {
                                    // scrollBy(index, animated)
                                    console.log(index);
                                }}
                                realmInstance={this.state.instance} 
                                search={this.props.searchTerm} />
                        </View>
                    )
                })
            }

            </Swiper>
        )
    }
}