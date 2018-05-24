import React from 'react';
import { 
    Text,
    TouchableHighlight ,
    View, 
    Image,
    Keyboard,
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

    showIndex = 0;

    state = {
        instance: null,
    };
    
    componentWillMount(){
        instance()
        .then( realm => {
            this.setState({
                instance: realm,
                startIndex: 0
            });
            realm.addListener('change', this.updateUi.bind(this));
        });
    }

    componentDidMount(){
        Keyboard.addListener('keyboardDidShow', () => {
            this.setState({
                startIndex: 0
            });
        });
    }

    componentWillUnmount(){
        this.state.instance.removeListener('change',this.updateUi);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.showProductsTab){
            this.activeIndex = 0;
        }
    }

    updateUi(){
        this.forceUpdate();
    }

    render(){
        return (
            <Swiper 
                index={this.state.startIndex}
                onTouchStartCapture={() => {
                    Keyboard.dismiss();
                }}
                onIndexChanged={ index => {
                    this.activeIndex = index;
                }}
                style={PagesWrapperStyle.wrapper} 
                showsPagination={true}
                renderPagination={(index,total,context) => {
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