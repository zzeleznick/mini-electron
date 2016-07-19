/* CAUTION: When using the generators, this file is modified in some places.
 *          This is done via AST traversal - Some of your formatting may be lost
 *          in the process - no functionality should be broken though.
 *          This modifications only run once when the generator is invoked - if
 *          you edit them, they are not updated again.
 */
import React, {
  Component,
  PropTypes
} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Main from '../components/Main';
import SubscribeComponent from '../components/SubscribeComponent';
/* Populated by react-webpack-redux:reducer */
class App extends Component {
  render() {
    const {actions, main, loginHandler, subscribeHandler} = this.props;
    return (
      <div >
        <Main onHide={actions.hide} onShow={actions.show} main={main}/>
        <SubscribeComponent loginHandler={loginHandler} auth_init={actions.auth_init}
        signin={actions.signin} signout={actions.signout}
        subscribeHandler={subscribeHandler} sub_init={actions.sub_init}
        subscribe={actions.subscribe} unsubscribe={actions.unsubscribe} notify={actions.notify}
        />;
      </div>
    );
  }
}
/* Populated by react-webpack-redux:reducer
 *
 * HINT: if you adjust the initial type of your reducer, you will also have to
 *       adjust it here.
 */
App.propTypes = {
  actions: PropTypes.object.isRequired,
  main: PropTypes.object.isRequired,
  loginHandler: PropTypes.object.isRequired,
  subscribeHandler: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  /* Populated by react-webpack-redux:reducer */
  const props = {
    main: state.main,
    loginHandler: state.loginHandler,
    subscribeHandler: state.subscribeHandler,
  };
  return props;
}
function mapDispatchToProps(dispatch) {
  /* Populated by react-webpack-redux:action */
  const actions = {
    hide: require('../actions/hide.js'),
    show: require('../actions/show.js'),
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
export default connect(mapStateToProps, mapDispatchToProps)(App);
