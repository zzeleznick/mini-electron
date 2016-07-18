require('styles/Subscribe.css');
import React from 'react';
import NameComponent from './NameComponent';
import { OAuthSignInButton } from 'redux-auth';

var reg;
var sub;
var REG_KEY = null;
var USERNAME = null;
var isSubscribed = false;

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

const notify = () => {
    if (REG_KEY == null) {
        console.warn('You must be subscribed to receive notifications');
        return
    }
    const args = [REG_KEY];
    makeRequest(notifyURL, args);
}

const showUserData = (user) => {
  if (user != null) {
    user.providerData.forEach(function (profile) {
      console.log('Profile', profile);
      console.log('Sign-in provider: ' + profile.providerId);
      console.log('Provider-specific UID: ' + profile.uid);
      console.log('Name: ' + profile.displayName);
      console.log('Email: ' + profile.email);
      console.log('Photo URL: ' + profile.photoURL);
    });
  }
  else {
    console.log('User is null')
  }
}


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log("User is signed in");
    console.log(user.providerData);
    const profile = user.providerData[0];
    USERNAME = profile.displayName != null ? profile.displayName :  profile.uid;
    showUserData(user);
  } else {
    // No user is signed in.
    var provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('user:email');
    // provide pop-up
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      const profile = user.providerData[0];
      USERNAME = profile.displayName != null ? profile.displayName :  profile.uid;
      showUserData(user);
    }).catch(function(error) {
      // Handle Errors here.
      console.warn('ERROR', error);
      console.warn('message: ', error.message);
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
    });
  }
});


class SubscribeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {subscribed: false};
    this.handleClick = this.handleClick.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }
  subscribe() {
      if (USERNAME == null) {
        alert("You must sign in first");
        return;
      }
      const subscribeButton = this.refs.button;
      reg.pushManager.subscribe({userVisibleOnly: true}).
      then(function(pushSubscription) {
        sub = pushSubscription;
        const buckets = sub.endpoint.split('/');
        REG_KEY = buckets[buckets.length-1];
        console.log('Subscribed! Reg Key:', REG_KEY);
        // Send the registration key
        saveSubscription(USERNAME, REG_KEY);
        // update button
        subscribeButton.textContent = 'Unsubscribe';
        isSubscribed = true;
        // then send a message to the service Worker
        console.warn("Trying to send a message to serviceWorker");
        navigator.serviceWorker.controller.postMessage({'username': USERNAME});
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
        console.log('ServiceWorker registration success:', registration.scope);
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
     <div className='subscribe'>
      <NameComponent/>
      <div className='btn btn-primary' ref='button' onClick={this.handleClick}> Subscribe </div>
      <div className='btn btn-warning' onClick={notify}> Send Notifaction </div>
     </div>
    );
  }
}


SubscribeComponent.displayName = 'SubscribeComponent';

// Uncomment properties you need
// SubscribeComponent.propTypes = {};
// SubscribeComponent.defaultProps = {};

export default SubscribeComponent;
