import { delay } from 'redux-saga';
import {
  call, put, takeEvery, takeLatest, all
} from 'redux-saga/effects';
import {
  JOIN_WALL, JOIN_WALL_SUCCESS, JOIN_WALL_FAIL, LEAVE_WALL,
  FETCH_POSTS, FETCH_POSTS_SUCCESS, FETCH_POSTS_FAIL,
} from 'state/action-types';
import * as firestore from 'services/firestore';

// worker sagas
export function* fetchPosts() {
  try {
    const posts = yield call(firestore.getPosts);
    const ids = Object.keys(posts);

    yield put({ type: FETCH_POSTS_SUCCESS, payload: { ids, byId: posts } });
  } catch (error) {
    yield put({ type: FETCH_POSTS_FAIL, error });
  }
}

export function* subscribeToWall(action) { // TODO: pass uid with action
  try {
    const response = yield call(firestore.subscribeToWall);
    yield put({ type: JOIN_WALL_SUCCESS, payload: response });
    // IDEA: or invoke it on JOIN_WALL_SUCCESS / FETCH_POSTS
    // yield call(fetchPosts);
    yield put({ type: FETCH_POSTS });
  } catch (e) {
    yield put({ type: JOIN_WALL_FAIL, message: e.message });
  }
}

export function* createPostFlow({ message }) {
  try {
    firestore.createPost(message);
    yield put({ type: 'POST_CREATED', message });
  } catch (e) {
    console.error(e);
  }
}

// watcher sagas
export function* watchJoinWall() { // TODO: rename to watchWallActions
  yield takeEvery(JOIN_WALL, subscribeToWall);
  yield takeEvery(FETCH_POSTS, fetchPosts);
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
