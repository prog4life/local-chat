import { SIGN_IN, SIGN_IN_SUCCESS, SIGN_IN_FAILURE, SIGN_OUT } from 'state/action-types';
import {
  call, put, takeEvery, takeLatest, all,
} from 'redux-saga/effects';
import firebase from 'firebase';
import firebaseClient from '../../services/firebase-client';

export function* authStateChangeSaga() {
  const authStateChangePromise = firebaseClient.handleAuthStateChange();

  // IDEA: yield call(() => authStateChangePromise);
  const { user, error } = yield authStateChangePromise;

  if (error) {
    console.log('AUTH STATE CHANGE ERROR from auth-saga');
    // yield put({ type: AUTH_STATE_CHANGE_ERROR, reason: e.message });
  }
  if (user) {
    const { uid, isAnonymous } = user;
    yield put({ type: SIGN_IN_SUCCESS, payload: { uid, isAnonymous } });
  } else {
    console.log('SIGNED OUT from auth-saga');
    // yield put({ type: SIGN_OUT });
  }
}

export function* signInSaga({ payload }) {
  // const authStateChangePromise = firebaseClient.handleAuthStateChange();

  if (!payload) {
    try {
      yield call(firebaseClient.signInAnonymously);
    } catch (e) {
      yield put({ type: SIGN_IN_FAILURE, reason: e.message });
    }
  }

  if (payload && typeof payload === 'object') {
    try {
      const { login, password } = payload;

      yield call(firebaseClient.signInWithEmail, login, password);
    } catch (e) {
      yield put({ type: SIGN_IN_FAILURE, reason: e.message });
    }
  }

  // // IDEA: yield call(() => authStateChangePromise);
  // const { user, error } = yield authStateChangePromise;
  //
  // if (error) {
  //   console.log('AUTH STATE CHANGE ERROR from auth-saga');
  //   // yield put({ type: AUTH_STATE_CHANGE_ERROR, reason: e.message });
  // }
  // if (user) {
  //   yield put({ type: SIGN_IN_SUCCESS, payload: { uid: user.uid } });
  // } else {
  //   console.log('SIGNED OUT from auth-saga');
  //   // yield put({ type: SIGN_OUT });
  // }
}

export function* signOutSaga() {
  try {
    yield call(firebaseClient.signOut);
    // TEMP: next 2 lines
    const user = firebase.auth().currentUser;
    console.log('SIGN OUT success from Saga, USER: ', user);
    // TODO: dispatch action that will clear uid ? and other auth data
  } catch (e) {
    put({ type: 'SIGN_OUT_FAILURE', reason: e.message });
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
