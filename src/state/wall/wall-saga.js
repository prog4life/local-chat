import { delay } from 'redux-saga';
import {
  call, put, takeEvery, takeLatest, all, select,
} from 'redux-saga/effects';
import {
  JOIN_WALL, JOIN_WALL_SUCCESS, JOIN_WALL_FAIL, LEAVE_WALL,
  FETCH_POSTS, FETCH_POSTS_SUCCESS, FETCH_POSTS_FAIL,
  FETCH_WALL_ID, FETCH_WALL_ID_SUCCESS, FETCH_WALL_ID_FAIL,
} from 'state/action-types';
import { getWallId, isFetchingPosts } from 'state/selectors';
import * as firestore from 'services/firestore';

// worker sagas
export function* fetchWallIdByCity({ city }) {
  try {
    const wallId = yield call(firestore.obtainWallIdByCity, city);
    console.log('Received wall id: ', wallId);
    
    yield put({ type: FETCH_WALL_ID_SUCCESS, payload: wallId });
  } catch (error) {
    yield put({ type: FETCH_WALL_ID_FAIL, error });
  }
}

export function* subscribeToWall({ payload }) { // TODO: pass uid with action
  let { wallId } = payload;
  try {
    const response = yield call(firestore.subscribeToWall, payload);
    yield put({ type: JOIN_WALL_SUCCESS, wallId });

    const state = yield select();
    const isFetching = isFetchingPosts(state);

    wallId = wallId || getWallId(state);

    if (!isFetching) {
      yield put({ type: FETCH_POSTS, filter: { wallId } });
    }
  } catch (error) {
    yield put({ type: JOIN_WALL_FAIL, error });
  }
}

// watcher sagas
export function* watchWallActions() {
  yield takeEvery(FETCH_WALL_ID, fetchWallIdByCity);
  yield takeEvery(JOIN_WALL, subscribeToWall);
}

export default function* wallSaga() {
  yield all([
    watchWallActions(),
  ]);
}
