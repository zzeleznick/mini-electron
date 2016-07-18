require('styles/Subscribe.css');
import React from 'react';
import NameComponent from './NameComponent';
import { OAuthSignInButton } from "redux-auth";

var reg;
var sub;
var REG_KEY = null
var isSubscribed = false;

const URL = 'http://localhost:5555/api';
const TASK_ENDPOINT = (name) => {
    return URL + "/task/async-apply/tasks." + name;
}
const subscribeURL = TASK_ENDPOINT("post_user");
const notifyURL = TASK_ENDPOINT("trigger_notifcation");

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

const notify = () => {
    if (REG_KEY == null) {
        console.warn("You must be subscribed to receive notifications");
        return
    }
    const args = [REG_KEY];
    makeRequest(notifyURL, args);
}

class SubscribeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {subscribed: false};
    this.handleClick = this.handleClick.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }
  subscribe() {
      const subscribeButton = this.refs.button;
      reg.pushManager.subscribe({userVisibleOnly: true}).
      then(function(pushSubscription) {
        sub = pushSubscription;
        const buckets = sub.endpoint.split("/");
        REG_KEY = buckets[buckets.length-1];
        console.log('Subscribed! Reg Key:', REG_KEY);
        // Send the registration key
        saveSubscription("zach", REG_KEY);
        // update button
        subscribeButton.textContent = 'Unsubscribe';
        isSubscribed = true;
      }).catch(function(error) {
        console.error('Error Subscribing', error);
    });
  }
  unsubscribe() {
    const subscribeButton = this.refs.button;
    sub.unsubscribe().then(function(event) {
        subscribeButton.textContent = 'Subscribe';
        console.log('Unsubscribed!', event);
        isSubscribed = false;
      }).catch(function(error) {
        console.log('Error unsubscribing', error);
        subscribeButton.textContent = 'Subscribe';
      });
  }
  handleClick(){
   if (isSubscribed) {
    this.unsubscribe();
    }
    else { this.subscribe(); }
  }
  componentDidMount() {
    const subscribeButton = this.refs.button;
    if ('serviceWorker' in navigator) {
      console.log('Service Worker is supported');
      navigator.serviceWorker.register('../sw.js')
      .then(function(registration) {
         // Registration was successful
        console.log('ServiceWorker registration successful with scope:',
            registration.scope);
        return navigator.serviceWorker.ready;
      }).catch(function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      })
      .then(function(serviceWorkerRegistration) {
        reg = serviceWorkerRegistration;
        subscribeButton.disabled = false;
        console.log('Service Worker is ready :^)', reg);
      }).catch(function(error) {
        console.log('Service Worker Error :^(', error);
      });
    }
  }
  render() {
    // const github = (<OAuthSignInButton>Github</OAuthSignInButton>);
    return (
     <div className="subscribe">
      <NameComponent/>
      <div className="btn btn-primary" ref='button' onClick={this.handleClick}> Subscribe </div>
      <div className="btn btn-warning" onClick={notify}> Send Notifaction </div>
     </div>
    );
  }
}


SubscribeComponent.displayName = 'SubscribeComponent';

// Uncomment properties you need
// SubscribeComponent.propTypes = {};
// SubscribeComponent.defaultProps = {};

export default SubscribeComponent;
