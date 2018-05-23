import React from 'react';
import {
    View,
    Text,
    TouchableHighlight
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
        <TouchableHighlight
            style={NavigationPagerStyle.tab}
            onPress={ () => onPress(index) }
        >
            <View>
                <View>
                    <Text style={NavigationPagerStyle.tabText}>{label}</Text>
                    <View style={NavigationPagerStyle[ active ? 'tabActive':'tabInActive' ] } />
                </View>
            </View>
        </TouchableHighlight>
    );
}

export default NavigationPagination = ({index, total, context}) => {
    return (
        <View style={NavigationPagerStyle.wrapper}>
            {
                Tabs.map( (item, i) => <Tab 
                                            index={i}
                                            onPress={ tappedIndex => {
                                                console.log(index - tappedIndex);
                                                context.scrollBy(index - tappedIndex,true)
                                            }}
                                            key={item} 
                                            label={item} 
                                            active={ i === index } /> )
            }
        </View>
    )
}