require('styles/Subscribe.css');
import React from 'react';

var reg;
var sub;
var isSubscribed = false;

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
        console.log('Subscribed! Endpoint:', sub.endpoint);
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
    return (
      <div className="btn" ref='button' onClick={this.handleClick}> Subscribe </div>
    );
  }
}


SubscribeComponent.displayName = 'SubscribeComponent';

// Uncomment properties you need
// SubscribeComponent.propTypes = {};
// SubscribeComponent.defaultProps = {};

export default SubscribeComponent;
