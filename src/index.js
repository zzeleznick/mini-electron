import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
import App from './containers/App';

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

// curl "https://android.googleapis.com/gcm/send" --request POST --header "Authorization: key=AIzaSyDakjHRlsttwpcvtXpkMHWw1wL0SO4co5Y" --header "Content-Type: application/json"  -d "{\"registration_ids\":[\"291834614873\"]}"