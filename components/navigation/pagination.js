import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import {
    NavigationPagerStyle
} from '../../assets/styles/main';

const Tabs = [
    'Products',
    'Transfers',
    'Sync'
];

const Tab = ({label, active, onPress, index}) => {
    return (
        <TouchableOpacity
            activeOpacity={.7}
            style={NavigationPagerStyle.tab}
            onPress={ () => onPress(index) }
        >
            <View>
                <View>
                    <Text style={NavigationPagerStyle.tabText}>{label}</Text>
                    <View style={NavigationPagerStyle[ active ? 'tabActive':'tabInActive' ] } />
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default NavigationPagination = ({index, total, context}) => {
    return (
        <View style={NavigationPagerStyle.wrapper}>
            {
                Tabs.map( (item, i) => <Tab 
                                            index={i}
                                            onPress={ tappedIndex => {
                                                context.scrollBy(tappedIndex - index,true)
                                                Keyboard.dismiss();
                                            }}
                                            key={item} 
                                            label={item} 
                                            active={ i === index } /> )
            }
        </View>
    )
}