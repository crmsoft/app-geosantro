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

export default class SearchBar extends React.Component{
    
    render(){
        return(
            <View style={SearchBarStyles.container}>
                <View style={SearchBarStyles.row}>
                    <TouchableHighlight onPress={ () => { console.log(52); } } style={SearchBarStyles.iconWrapper}>
                        <Image
                            style={SearchBarStyles.imageIcon}
                            source={require('../../assets/img/search.jpg')}
                        />
                    </TouchableHighlight>
                    <View style={SearchBarStyles.searchInputWrapper}>
                        <TextInput 
                            onChangeText={(text) => this.props.handleFilter(text.trim())}
                            style={SearchBarStyles.searchInput}
                            placeholder="Search Products"
                        />
                    </View>
                    <TouchableHighlight 
                        onPress={ () => this.props.transfersPress() }
                        style={SearchBarStyles.iconWrapper}>
                        <Image
                            style={SearchBarStyles.imageIcon}
                            source={require('../../assets/img/sync.jpg')}
                        />
                    </TouchableHighlight >
                </View>
            </View>
        )
    }
}