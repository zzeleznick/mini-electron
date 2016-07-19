require('styles/Subscribe.css');
require("font-awesome-webpack");
import React from 'react';
import NameComponent from './NameComponent';

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

class SubscribeComponent extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {subscribed: false, loggedin: false, forceSignout: false};
    this.handleClick = this.handleClick.bind(this);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.handleUnsubscribe = this.handleUnsubscribe.bind(this);
    this.regFirebaseAuth = this.regFirebaseAuth.bind(this);
    this.handleSignin = this.handleSignin.bind(this);
  }
  regFirebaseAuth() {
    const { auth_init } = this.props;
    auth_init(showUserData);
  }
  handleSignin(){
    const { signin, signout } = this.props;
    const { loggedin } = this.props.loginHandler;
    if (!loggedin) {
        console.log('Going to call signin');
        signin(showUserData);
    }
    else {
        console.log('Going to call signout');
        signout();
    }
  }
  handleSubscribe() {
      const { userid } = this.props.loginHandler;
      const { subscribe } = this.props;
      if (userid == null) {
        alert('You must sign in first');
        return;
      }
      subscribe();
  }
  handleUnsubscribe() {
    const { unsubscribe } = this.props;
    unsubscribe();
  }
  handleClick(){
    const { subscribed } = this.props.subscribeHandler;
   if (subscribed) {
    this.handleUnsubscribe();
    }
    else { this.handleSubscribe(); }
  }
  componentWillMount() {
    console.log('Mounting Firebase auth listener');
    this.regFirebaseAuth();
  }
  componentDidMount() {
    const { sub_init } = this.props;
    const subscribeButton = this.refs.button;
    const callback = (err) => {
      subscribeButton.disabled = err != null;
      return;
    }
    sub_init(callback);
  }
  render() {
    const { notify } = this.props;
    const { loggedin } = this.props.loginHandler;
    console.log(this.props.loginHandler, loggedin);
    const { subscribed } = this.props.subscribeHandler;
    const signinText = !loggedin ? 'Sign in' : 'Sign out'
    const subscribeText = !subscribed ? 'Subscribe' : 'Unsubscribe'
    return (
     <div className='subscribe'>
      <NameComponent/>
      <div className='btn btn-danger' ref='signin' onClick={this.handleSignin}>
         <i className='fa fa-github fa-lg' aria-hidden='true'></i> {signinText}
      </div>
      <div className='btn btn-primary' ref='button' onClick={this.handleClick}> {subscribeText} </div>
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
