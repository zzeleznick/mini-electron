import {AUTH_INIT} from './const';

module.exports = function(callback) {
    if (callback == undefined ) {
        callback = (err) => {};
    }
  return { type: AUTH_INIT, callback: callback};
};
