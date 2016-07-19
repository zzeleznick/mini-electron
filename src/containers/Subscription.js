import React, {
  Component,
  PropTypes
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SubscribeComponent from '../components/SubscribeComponent';

class Subscription extends Component {
  render() {
    const {actions, loginHandler, subscribeHandler} = this.props;
    return <SubscribeComponent loginHandler={loginHandler} auth_init={actions.auth_init}
        signin={actions.signin} signout={actions.signout}
        subscribeHandler={subscribeHandler} sub_init={actions.sub_init}
        subscribe={actions.subscribe} unsubscribe={actions.unsubscribe} notify={actions.notify}
    />;
  }
}

Subscription.propTypes = {
  actions: PropTypes.object.isRequired,
  loginHandler: PropTypes.object.isRequired,
  subscribeHandler: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const props = {
    loginHandler: state.loginHandler,
    subscribeHandler: state.subscribeHandler,
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  const actions = {
    subscribe: require('../actions/subscribe.js'),
    unsubscribe: require('../actions/unsubscribe.js'),
    signin: require('../actions/signin.js'),
    signout: require('../actions/signout.js'),
    notify: require('../actions/notify.js'),
    auth_init: require('../actions/auth_init.js'),
    sub_init: require('../actions/sub_init.js'),
  };
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscription);
