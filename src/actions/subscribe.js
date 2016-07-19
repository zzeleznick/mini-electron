import {SUBSCRIBE} from './const';

module.exports = function(userid) {
  return { type: SUBSCRIBE, userid: userid };
};