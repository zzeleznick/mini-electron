/* Define your initial state here.
 *
 * If you change the type from object to something else, do not forget to update
 * src/container/App.js accordingly.
 */
import {SIGNIN, SIGNOUT, AUTH_INIT} from '../actions/const';
const initialState = {loggedin: false, userid: null, username: null};

module.exports = function(state = initialState, action) {
  /* Keep the reducer clean - do not mutate the original state. */
  let nextState = Object.assign({}, state);

  switch(action.type) {
    case AUTH_INIT: {
      const callback = action.callback;
      firebase.auth().onAuthStateChanged(function(user) {
        console.log('Auth state changed');
        if (user) {
          // User is signed in.
          nextState.loggedin = true;
          console.log('User is signed in');
          const profile = user.providerData[0];
          const userid = profile.uid;
          const username = profile.displayName != null ? profile.displayName :  profile.uid;
          nextState.userid = userid;
          nextState.username = username;
          callback(user);
        } else {
          // No user is signed in.
          console.log('User is not signed in');
          nextState = Object.assign({}, initialState);
        }
      });
       console.log("Post State Change:", nextState);
       return nextState;
    }
    case SIGNOUT: {
      console.log('User requests sign out');
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.warn('User has signed out');
      }, function(error) {
        console.warn('Signout error');
      });
      nextState = Object.assign({}, initialState);
      return nextState;
    }
    case SIGNIN: {
      const callback = action.callback;
      var provider = new firebase.auth.GithubAuthProvider();
      provider.addScope('user:email');
      // provide pop-up
      firebase.auth().signInWithPopup(provider).then(function(result) {
        console.log('Popup triggered');
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        const profile = user.providerData[0];
        const userid = profile.uid;
        const username = profile.displayName != null ? profile.displayName :  profile.uid;
        nextState.userid = userid;
        nextState.username = username;
        nextState.loggedin = true;
        callback(user);
      }).catch(function(error) {
        // Handle Errors here.
        console.warn('ERROR', error);
        console.warn('message: ', error.message);
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      });
      console.log("Post pop-up", nextState);
      return nextState;
    }
    default: {
      /* Return original state if no actions were consumed. */
      return state;
    }
  }
}
