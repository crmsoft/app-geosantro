import React from 'react';
import { 
    Text,
    TouchableHighlight ,
    View, 
    Image,
    TextInput 
} from 'react-native';
import { 
    SearchBarStyles,
} from '../../assets/styles/main';
import { 
    COLOR_PRIMARY 
} from '../../assets/styles/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default class SearchBar extends React.Component{
    
    render(){
        return(
            <View style={SearchBarStyles.container}>
                <View style={SearchBarStyles.row}>
                    <TouchableHighlight style={SearchBarStyles.iconWrapper}>
                        <Icon name="search" size={30} color="#333333" />
                    </TouchableHighlight>
                    <View style={SearchBarStyles.searchInputWrapper}>
                        <TextInput
                            onFocus={ () => this.props.handleFocus() } 
                            onChangeText={(text) => this.props.handleFilter(text.trim())}
                            style={SearchBarStyles.searchInput}
                            placeholder="Search Products"
                        />
                    </View>
                    <TouchableHighlight 
                        onPress={ () => this.props.transfersPress() }
                        style={SearchBarStyles.iconWrapper}>
                            <Icon name="compare-arrows" size={30} color="#333333" />
                    </TouchableHighlight >
                </View>
            </View>
        )
    }
}