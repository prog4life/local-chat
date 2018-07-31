import { SIGN_IN, SIGN_OUT, SIGN_IN_SUCCESS, SIGNED_OUT } from 'state/action-types';
import firebase from 'firebase';
import firebaseClient from '../../services/firebase-client';

export const signIn = () => ({ type: SIGN_IN });
export const signOut = () => {
  // firebaseClient.signOut();

  return { type: SIGN_OUT };
};

export const signInWithEmail = (email, password) => ({
  type: SIGN_IN,
  payload: { email, password },
});

// Do NOT use this value to authenticate with your backend server, if
// you have one. Use User.getToken() instead
// NOTE: const user = firebase.auth().currentUser; // current user or null

export const processAuthStateChange = () => dispatch => (
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      const { isAnonymous, uid } = user;
      const {
        displayName, email, emailVerified, photoURL, providerData,
      } = user;

      dispatch({ type: SIGN_IN_SUCCESS, payload: { uid, isAnonymous } });
    } else {
      // User is signed out
      dispatch({ type: 'AUTH_STATE_CHANGE_NO_USER' });
    }
  }, (error) => {
    dispatch({ type: 'AUTH_STATE_CHANGE_ERROR', error });
  })
);
