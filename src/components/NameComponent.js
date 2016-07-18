require('styles/Name.css');
import React from 'react';

const URL = 'http://localhost:5555/api';
const TASK_ENDPOINT = (name) => {
    return URL + '/task/async-apply/tasks.' + name;
}

const postURL = TASK_ENDPOINT('post_dummy_data');

const makeRequest = () => {
  fetch(postURL, {
  method: 'POST',
  mode: 'no-cors',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    args: [1]
  })
}).then(function(data) {
    console.log('request succeeded with JSON response', data)
 }).catch(function(error) {
    console.log('request failed', error)
  })
}

// makeRequest();

class NameComponent extends React.Component {
  render() {
    return (
      <div className='btn btn-warning' onClick={makeRequest}>Post Row</div>
    );
  }
}

NameComponent.displayName = 'NameComponent';

// Uncomment properties you need
// NameComponent.propTypes = {};
// NameComponent.defaultProps = {};

export default NameComponent;
