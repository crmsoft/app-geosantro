import React from 'react';
import {
    View,
    Text
} from 'react-native';
import {
    NavigationPagerStyle
} from '../../assets/styles/main';

const Tabs = [
    'Products',
    'Transfers',
    'Sync'
];

const Tab = ({label, active}) => {
    return (
        <View style={NavigationPagerStyle.tab}>
            <View>
                <Text style={NavigationPagerStyle.tabText}>{label}</Text>
                <View style={NavigationPagerStyle[ active ? 'tabActive':'tabInActive' ] } />
            </View>
        </View>
    );
}

export default NavigationPagination = (index, total, context) => {
    return (
        <View style={NavigationPagerStyle.wrapper}>
            {
                Tabs.map( (item, i) => <Tab key={item} label={item} active={ i === index }/> )
            }
        </View>
    )
}