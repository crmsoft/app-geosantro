import React from 'react';
import {
    View
} from 'react-native';
import {
    ContainerStyles
} from '../assets/styles/main'
import SearchBar from './search-bar';
import Nav from './navigation';
import { createStackNavigator } from 'react-navigation';

export default class AppView extends React.Component {
    
    state = {
        term: '',
        focused: false
    }

    constructor(props){
        super(props)
    }

    render() {
        return (
            <View style={ContainerStyles.mainContainer}>
                <SearchBar 
                    handleFocus={ () => this.setState({ focused:true }) }
                    handleFilter={ term => this.setState({term}) }
                    transfersPress={
                        () => {
                            this.props.navigate('UnsavedTransfers');
                        }
                    }/>
                <Nav 
                    showProductsTab={this.state.focused}
                    searchTerm={this.state.term} 
                    />
            </View>
        );
    }
}