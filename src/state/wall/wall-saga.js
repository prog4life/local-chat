import { delay } from 'redux-saga'
import { put, takeEvery, all } from 'redux-saga/effects';

function* subscribeToWall(data) {
  yield put({ type: 'fetchWallPosts SAGA started', data });

  const result = yield Promise.resolve({ success: 'OK' }).then(
    response => put({ type: 'subscribeToWall SAGA fullfiled', response }),
    e => put({ type: 'subscribeToWall SAGA rejected', message: e.message }),
  );

  yield result;
}

function* watchJoinWall() {
  yield takeEvery('JOIN_WALL', subscribeToWall);
}

export default function* wallSaga() {
  yield all([
    watchJoinWall(),
  ]);
}
