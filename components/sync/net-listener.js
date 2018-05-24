import { NetInfo } from 'react-native';
import { Alert } from 'react-native';
import { createStore } from 'redux'

export const STATE_OFFLINE = 'offline';
export const STATE_ONLINE = 'online';

const netState = (state = STATE_OFFLINE, action) => {
    console.log(state,action)
    switch(action.type) {
        case 'TO_ONLINE': {
            return STATE_ONLINE;
        } break;
        case 'TO_OFFLINE': {
            return STATE_OFFLINE;
        } break;
        default: return STATE_OFFLINE;
    }
}

export const networkStore = createStore(netState);
networkStore.subscribe(() => {
    console.log( `the current inet state is: ${networkStore.getState()}` )
})
export const alertNoConnection = () => {
    Alert.alert(
        'Internet Connection, Offline',
        'Please check that you are connected to the Internet and try again',
        [
          {text: 'Ok'},
        ]
    );
}

NetInfo.isConnected.fetch().then(() => {
    NetInfo.isConnected.fetch().then(isConnected => {
        networkStore.dispatch({type:isConnected ? 'TO_ONLINE':'TO_OFFLINE'});
    });
    NetInfo.addEventListener('connectionChange', isConnected => {
        const {type} = isConnected;
        networkStore.dispatch({
            type: ( type !== 'none' && type !== 'unknown' ) ? 'TO_ONLINE':'TO_OFFLINE'
        });
    })
});