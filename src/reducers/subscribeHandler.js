/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
import {SUB_INIT, SUBSCRIBE, UNSUBSCRIBE, NOTIFY} from '../actions/const';

const URL = 'http://localhost:5555/api';
const TASK_ENDPOINT = (name) => {
    return URL + '/task/async-apply/tasks.' + name;
}
const subscribeURL = TASK_ENDPOINT('post_user');
const notifyURL = TASK_ENDPOINT('trigger_notifcation');

const makeRequest = (url, args) => {
  fetch(url, {
  method: 'POST',
  mode: 'no-cors',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    args: args
  })
}).then(function(data) {
    console.log('request succeeded with JSON response', data)
 }).catch(function(error) {
    console.log('request failed', error)
  })
}

const saveSubscription = (name, regKey) => {
    const args = [name, regKey];
    makeRequest(subscribeURL, args);
}
const notify = (regKey) => {
    if (!regKey) {
      alert('You must be subscribed to receive notifications');
      return
    }
    const args = [regKey];
    makeRequest(notifyURL, args);
}

const initialState = {subscribed: false, regKey: null, regWorker: null, subscription: null};

module.exports = function(state = initialState, action) {
  /* Keep the reducer clean - do not mutate the original state. */
  let nextState = Object.assign({}, state);

  switch(action.type) {
    case SUB_INIT: {
      const { callback } = action;
      if ('serviceWorker' in navigator) {
        console.log('Service Worker is supported');
        navigator.serviceWorker.register('../sw.js')
        .then(function(registration) {
           // Registration was successful
          console.log('ServiceWorker registration success:', registration.scope);
          return navigator.serviceWorker.ready;
        }).catch(function(err) {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
        })
        .then(function(serviceWorkerRegistration) {
          // Initialize the regWorker
          const regWorker = serviceWorkerRegistration;
          nextState.regWorker = regWorker;
          console.log('Service Worker is ready :^)', regWorker);
          callback(null);
        }).catch(function(error) {
          console.log('Service Worker Error :^(', error);
          callback(error);
        });
      }
      return nextState;
    }
    case UNSUBSCRIBE: {
      const { subscription } = this.state;
      subscription.unsubscribe().then(function(event) {
        console.log('Unsubscribed!', event);
        nextState.subscribed = false;
        nextState.regKey = null;
        nextState.subscription = null;
      }).catch(function(error) {
        console.log('Error unsubscribing', error);
      });
      return nextState;
    }
    case SUBSCRIBE: {
      const { userid } = action;
      const { regWorker } = this.state;
      regWorker.pushManager.subscribe({userVisibleOnly: true}).
      then(function(pushSubscription) {
        nextState.subscription = pushSubscription;
        const buckets = pushSubscription.endpoint.split('/');
        const regKey = buckets[buckets.length-1];
        nextState.regKey = regKey;
        console.log('Subscribed', userid, 'Reg Key:', regKey);
        // Send the registration key
        saveSubscription(userid, regKey);
        // update button
        subscribeButton.textContent = 'Unsubscribe';
        nextState.subscribed = true;
        // then send a message to the service Worker
        console.warn('Trying to send a message to serviceWorker');
        navigator.serviceWorker.controller.postMessage({'username': USERNAME});
      }).catch(function(error) {
        console.error('Error Subscribing', error);
      });
      return nextState;
    }
    case NOTIFY: {
      const { regKey } = state;
      notify(regKey);
      return nextState;
    }
    default: {
      /* Return original state if no actions were consumed. */
      return state;
    }
  }
}
