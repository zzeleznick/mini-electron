import {SUB_INIT} from './const';

module.exports = function(callback) {
    if (callback == undefined ) {
        callback = (err) => {return};
    }
  return { type: SUB_INIT, callback: callback};
};
