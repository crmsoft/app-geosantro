import { NetInfo } from 'react-native';
import { createStore } from 'redux';

export const REQUEST_G = 'REQUEST_G'
function requestG() {
  return {
    type: REQUEST_G
  }
}
​
export const RECEIVE_RESPONSE = 'RECEIVE_RESPONSE'
function receivePosts(isConnected) {
  return {
    type: RECEIVE_RESPONSE,
    isConnected: isConnected
  }
}
​
// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
​
export function fetchPosts(subreddit) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
​
  return function (dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.
​
    dispatch(requestG())
​
    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.
​
    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.
​
    return fetch(`https://google.com`)
      .then(
        response => response.status === 200,
        // Do not use catch, because that will also catch
        // any errors in the dispatch and resulting render,
        // causing a loop of 'Unexpected batch number' errors.
        // https://github.com/facebook/react/issues/6895
        error => false
      )
      .then(inteConnectionState =>
        // We can dispatch many times!
        // Here, we update the app state with the results of the API call.
​
        dispatch(receivePosts(inteConnectionState))
      )
  }
}

export const INVALIDATE_G = 'INVALIDATE_G'
export function invalidateSubreddit() {
  return {
    type: INVALIDATE_G
  }
}

function postsBySubreddit(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_G:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state)
    default:
      return state
  }
}





export const netEvent = createStore(handleConnectivityChange);




/*
export const netEvent = createStore(handleConnectivityChange);

const handleConnectivityChange = (state = false,status) => {
  const { type } = status;
  let probablyHasInternet;
  try {
    const googleCall = await fetch('https://google.com');
    probablyHasInternet = googleCall.status === 200;
  } catch (e) {
    probablyHasInternet = false;
  }

  console.log(`@@ isConnected: ${probablyHasInternet}`);
  return probablyHasInternet;
}*/

NetInfo.getConnectionInfo().then(() => store.dispatch(handleConnectivityChange));
NetInfo.addEventListener('connectionChange', () => store.dispatch(handleConnectivityChange));

