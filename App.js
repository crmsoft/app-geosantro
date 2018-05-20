import React, { Component } from 'react';
import Splash from './components/splash';
import AppView from './components';
import UTransfers from './components/pre-transfer';
import { createStackNavigator } from 'react-navigation';

class App extends Component {
  
  static navigationOptions = {
    header: null
  };

  constructor(){
    super()
    this.state = {
      applicationIsReady: false
    }
  }

  componentDidMount(){
    setTimeout(() => {
      this.setState({ applicationIsReady: true })
    }, 150);

    setTimeout(() => {

    },2500);
  }
 
  render() {    
    return (
      this.state.applicationIsReady ? <AppView navigate={this.props.navigation.navigate} /> : <Splash />        
    );
  }
}

export default createStackNavigator(
{
  Home: {
    screen: App
  },
  UnsavedTransfers: {
    screen: UTransfers
  }
}, 
{ 
});
   