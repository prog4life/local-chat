import {
  call, put, take, takeEvery, takeLatest, all, select
} from 'redux-saga/effects';
import {
  SIGN_IN, SIGN_IN_SUCCESS, SIGN_IN_FAILURE, SIGN_OUT, SIGNED_OUT,
} from 'state/action-types';
import { getUid, isAnonymousSelector } from 'state/selectors';
// import firebase from 'firebase';
import firebase from 'firebase/app';
import firebaseClient from '../../services/firebase-client';

export function* authStateChangeSaga() {
  while (true) {
    const authStateChangePromise = firebaseClient.handleAuthStateChange();

    // IDEA: yield call(() => authStateChangePromise);
    const { user, error } = yield authStateChangePromise;

    if (error) {
      yield put({ type: 'AUTH_STATE_CHANGE_ERROR', error });
    }
    if (user) {
      const { uid, isAnonymous } = user;
      yield put({ type: SIGN_IN_SUCCESS, payload: { uid, isAnonymous } });
    } else {
      yield put({ type: SIGNED_OUT });
    }
  }
}

// link anonymous user to email-password user account
// export function* linkAnonymousUser(email, password) {
//   const credential = firebaseClient.getEmailCredential(email, password);
//   console.log('Credential: ', credential);
//
//   yield call(firebaseClient.linkAccount, credential);
// }

export function* signInSaga({ payload }) {
  // TODO: add backoff                                              !!!
  const state = yield select();
  const uid = getUid(state);
  // null - signed out, true - signed in anonymously, false - signed in
  const isAnonymous = isAnonymousSelector(state);
  console.log('Sign In UID: ', uid);
  // sign in anonymously
  if (!payload && !uid) {
    try {
      yield call(firebaseClient.signInAnonymously);
    } catch (e) {
      yield put({ type: SIGN_IN_FAILURE, code: e.code, message: e.message });
    }
  }
  if (typeof payload !== 'object') {
    console.warn('SIGN IN PAYLOAD is not an object');
    return;
  }
  if (uid && isAnonymous === false) { // signed in with email already
    console.warn('SIGNED IN with email already');
    return;
  }

  const { email, password } = payload;

  // if (state.client.uid && state.client.isAnonymous) {
  //   linkAnonymousUser(email, password);
  //   return;
  // }

  try {
    yield call(firebaseClient.signInWithEmail, email, password);
  } catch (e) {
    yield put({ type: SIGN_IN_FAILURE, code: e.code, message: e.message });
  }
}

export function* signOutSaga() {
  try {
    yield call(firebaseClient.signOut);

    const user = firebase.auth().currentUser; // TEMP:

    yield put({ type: SIGNED_OUT, user });
  } catch (error) {
    yield put({ type: 'SIGN_OUT_FAILURE', error });
  }
}

export function* watchSignIn() {
  // yield takeEvery(AUTH_INITIALIZE, authStateChangeSaga);
  yield takeEvery(SIGN_IN, signInSaga);
}

export function* watchSignOut() {
  yield takeEvery(SIGN_OUT, signOutSaga);
}

export default function* authSaga() {
  yield all([
    // authStateChangeSaga(),
    watchSignIn(),
    watchSignOut(),
  ]);
}
