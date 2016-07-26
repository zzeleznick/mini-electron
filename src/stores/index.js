const redux = require('redux');
const reducers = require('../reducers');
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

module.exports = function(initialState) {
  const store = redux.createStore(reducers, initialState,
    // Add Redux Dev Tools
    window.devToolsExtension && window.devToolsExtension(),
    applyMiddleware(thunk)
    );
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers')
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
