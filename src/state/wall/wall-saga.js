import { delay } from 'redux-saga';
import {
  call, put, takeEvery, takeLatest, all, select,
} from 'redux-saga/effects';
import {
  JOIN_WALL, JOIN_WALL_SUCCESS, JOIN_WALL_FAIL, LEAVE_WALL,
  FETCH_POSTS, FETCH_POSTS_SUCCESS, FETCH_POSTS_FAIL,
  FETCH_WALL_ID, FETCH_WALL_ID_SUCCESS, FETCH_WALL_ID_FAIL,
} from 'state/action-types';
import { getWallId } from 'state/selectors';
import * as firestore from 'services/firestore';

// worker sagas
export function* fetchPostsFlow(action) {
  try {
    const posts = yield call(firestore.getPosts, action.filter);
    const ids = Object.keys(posts);

    yield put({ type: FETCH_POSTS_SUCCESS, payload: { ids, byId: posts } });
  } catch (error) {
    yield put({ type: FETCH_POSTS_FAIL, error });
  }
}

export function* fetchWallIdByCity(action) {
  try {
    const walls = yield call(firestore.getWallsByCity, action.city);
    
    console.log('Received wall id: ', walls[0].id)
    
    yield put({ type: FETCH_WALL_ID_SUCCESS, payload: walls[0].id }) // TEMP
  } catch (error) {
    yield put({ type: FETCH_WALL_ID_FAIL, error });
  }
}

export function* subscribeToWall(action) { // TODO: pass uid with action
  try {
    const { wallId } = action.payload;
    const response = yield call(firestore.subscribeToWall, action.payload);
    yield put({ type: JOIN_WALL_SUCCESS, wallId });

    // IDEA: or invoke it on JOIN_WALL_SUCCESS / FETCH_POSTS
    // yield call(fetchPostsFlow);

    yield put({ type: FETCH_POSTS, filter: { wallId } });
  } catch (error) {
    yield put({ type: JOIN_WALL_FAIL, error });
  }
}

// watcher sagas
export function* watchWallActions() {
  yield takeEvery(FETCH_WALL_ID, fetchWallIdByCity);
  yield takeEvery(JOIN_WALL, subscribeToWall);
  yield takeEvery(FETCH_POSTS, fetchPostsFlow);
}

export default function* wallSaga() {
  yield all([
    watchWallActions(),
  ]);
}
