import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { SIGN_IN, SIGN_IN_SUCCESS, SIGN_IN_FAILURE } from 'state/action-types';
import firebaseClient from '../../services/firebase-client';

export function* signInSaga(signInAction) {
  const authStateChangePromise = firebaseClient.handleAuthStateChange();

  if (!signInAction.payload) {
    try {
      yield call(firebaseClient.signInAnonymously);
    } catch (e) {
      yield put({ type: SIGN_IN_FAILURE, reason: e.message });
    }
  }

  let user;

  try {
    // IDEA: yield call(() => authStateChangePromise);
    user = yield authStateChangePromise;
  } catch (e) {
    console.log('AUTH STATE CHANGE ERROR');
    // yield put({ type: AUTH_STATE_CHANGE_ERROR, reason: e.message });
  }

  if (user) {
    yield put({ type: SIGN_IN_SUCCESS, payload: { uid: user.uid } });
  } else {
    console.log('SIGNED OUT');
    // yield put({ type: SIGN_OUT });
  }
}

export function* watchSignIn() {
  yield takeEvery(SIGN_IN, signInSaga);
}

export default function* authSaga() {
  yield watchSignIn();
}
