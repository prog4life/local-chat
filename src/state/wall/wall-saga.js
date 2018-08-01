import { delay } from 'redux-saga';
import {
  call, put, takeEvery, takeLatest, all
} from 'redux-saga/effects';
import {
  JOIN_WALL, JOIN_WALL_SUCCESS, JOIN_WALL_FAIL, LEAVE_WALL,
} from 'state/action-types';
import firebaseClient from '../../services/firebase-client';

// worker saga
export function* subscribeToWall(action) { // TODO: pass uid with action
  try {
    const response = yield call(firebaseClient.subscribeToWall);
    yield put({ type: JOIN_WALL_SUCCESS, payload: response });
  } catch (e) {
    yield put({ type: JOIN_WALL_FAIL, message: e.message });
  }
}

export function* createPostFlow({ message }) {
  try {
    firebaseClient.createPost(message);
    yield put({ type: 'POST_CREATED', message });
  } catch (e) {
    console.error(e);
  }
}

// watcher saga
export function* watchJoinWall() {
  yield takeEvery(JOIN_WALL, subscribeToWall);
}

export function* watchCreatePost() {
  yield takeEvery('CREATE_POST', createPostFlow);
}

export default function* wallSaga() {
  yield all([
    watchJoinWall(),
    watchCreatePost(),
  ]);
}
