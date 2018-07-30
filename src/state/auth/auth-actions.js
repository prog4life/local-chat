import { SIGN_IN, SIGN_OUT, SIGN_IN_SUCCESS } from 'state/action-types';
import firebase from 'firebase';
import firebaseClient from '../../services/firebase-client';

export const signIn = () => ({ type: SIGN_IN });
export const signOut = () => {
  firebaseClient.signOut();

  return { type: SIGN_OUT };
};

export const signInWithEmail = (login, password) => ({
  type: SIGN_IN,
  payload: { login, password },
});

export const processAuthStateChange = () => dispatch => (
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in.
      const { isAnonymous, uid } = user;
      const {
        displayName, email, emailVerified, photoURL, providerData,
      } = user;

      dispatch({ type: SIGN_IN_SUCCESS, payload: { uid, isAnonymous } });
    } else {
      // User is signed out.
      dispatch({ type: 'SIGN_OUT_SUCCESS' });
    }
  }, (error) => {
    console.error('Auth state change ERROR: ', error);
    dispatch({ type: 'AUTH_STATE_CHANGE_ERROR' });
  })
);
