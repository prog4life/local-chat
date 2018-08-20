import {
  call, put, take, takeEvery, takeLatest, all, select
} from 'redux-saga/effects';
import * as aT from 'state/action-types';
import { getUid, isAnonymousSelector } from 'state/selectors';
// import firebase from 'firebase';
import firebase from 'firebase/app';
import firebaseClient from '../../services/firebase-client';

export function* signInAnonSaga() {
  try {
    yield call(firebaseClient.signInAnonymously);
  } catch (error) {
    yield put({ type: aT.SIGN_IN_ANON_FAIL, error });
  }
}

export function* signInWithEmailSaga({ payload }) {
  // TODO: check email and password exactly ?
  if (typeof payload !== 'object') {
    throw new Error('SIGN IN WITH EMAIL payload is not an object');
  }
  // TEMP:
  const state = yield select();
  const uid = getUid(state);
  const isAnonymous = isAnonymousSelector(state);

  if (uid && isAnonymous === false) { // signed in with email already
    console.warn('SIGNED IN with email already');
    return;
  }
  // TEMP: END

  // TODO:
  // if (isAuthenticating) {
  //   return;
  // }

  const { email, password } = payload;

  try {
    yield call(firebaseClient.signInWithEmail, email, password);
  } catch (error) {
    yield put({ type: aT.SIGN_IN_EMAIL_FAIL, error });
  }
}

export function* signOutSaga() {
  try {
    yield call(firebaseClient.signOut);

    const user = firebase.auth().currentUser; // TEMP:

    yield put({ type: aT.SIGNED_OUT, user });
  } catch (error) {
    yield put({ type: 'SIGN_OUT_FAIL', error });
  }
}

export function* watchSignIn() {
  // yield takeEvery(aT.AUTH_INITIALIZE, authStateChangeSaga);
  // yield takeEvery(aT.SIGN_IN_IF_NEED, signInSaga);
  yield takeEvery(aT.SIGN_IN_ANON, signInAnonSaga);
  yield takeEvery(aT.SIGN_IN_EMAIL, signInWithEmailSaga);
}

export function* watchSignOut() {
  yield takeEvery(aT.SIGN_OUT, signOutSaga);
}

export default function* authSaga() {
  yield all([
    // authStateChangeSaga(),
    watchSignIn(),
    watchSignOut(),
  ]);
}

// export function* authStateChangeSaga() {
//   while (true) {
//     const authStateChangePromise = firebaseClient.handleAuthStateChange();

//     // IDEA: yield call(() => authStateChangePromise);
//     const { user, error } = yield authStateChangePromise;

//     if (error) {
//       yield put({ type: 'AUTH_STATE_CHANGE_ERROR', error });
//     }
//     if (user) {
//       const { uid, isAnonymous } = user;
//       yield put({ type: aT.SIGN_IN_SUCCESS, payload: { uid, isAnonymous } });
//     } else {
//       yield put({ type: aT.SIGNED_OUT });
//     }
//   }
// }

// link anonymous user to email-password user account
// export function* linkAnonymousUser(email, password) {
//   const credential = firebaseClient.getEmailCredential(email, password);
//   console.log('Credential: ', credential);
//
//   yield call(firebaseClient.linkAccount, credential);
// }

// export function* signInSaga() {
//   // TODO: add backoff                                              !!!
//   const state = yield select();
//   const uid = getUid(state);
//   // null - signed out, true - signed in anonymously, false - signed in
//   const isAnonymous = isAnonymousSelector(state);
//   console.log('Sign In UID: ', uid, ', is Anonynous: ', isAnonymous);

//   // is 2nd necessary (e.g. to check if auth requested already) ???
//   // during auth request "isAnonymous" will be true/false, but not null
//   // better to replace it by isAuthenticating
//   if (!uid || isAnonymous === null) {
//     yield put({ type: aT.SIGN_IN_ANON });
//   }
// }
