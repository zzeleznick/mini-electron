import {SIGNIN} from './const';

module.exports = function(callback) {
    if (callback == undefined ) {
        callback = (user) => {};
    }
  return { type: SIGNIN, callback: callback};
};
