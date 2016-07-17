/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
import {SHOW, HIDE} from '../actions/const';

const hiddenColumnIndices = [3];

const initialState = {"indices": hiddenColumnIndices};

module.exports = function(state = initialState, action) {
  /* Keep the reducer clean - do not mutate the original state. */
  let nextState = Object.assign({}, state);
  const idx = action.index;
  switch(action.type) {
    case SHOW: {
      // Modify next state depending on the action and return it
      var indices = nextState.indices;
      var pos = indices.indexOf(idx);
      if ( pos != -1) {
        nextState.indices = indices.slice(0, pos).concat(indices.slice(pos+1));
      }
      return nextState;
    }
    case HIDE: {
      // Modify next state depending on the action and return it
      nextState.indices.push(idx)
      return nextState;
    }
    default: {
      /* Return original state if no actions were consumed. */
      return state;
    }
  }
}
