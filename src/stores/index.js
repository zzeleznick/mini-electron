const redux = require('redux');
const reducers = require('../reducers');

module.exports = function(initialState) {
  const store = redux.createStore(reducers, initialState,
    // Add Redux Dev Tools
    window.devToolsExtension && window.devToolsExtension()
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
