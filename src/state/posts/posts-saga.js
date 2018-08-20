import {
  call, put, takeEvery, select, all,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import * as aT from 'state/action-types';
import * as firestore from 'services/firestore';
import { getWallId, isPostRemovalRequested } from 'state/selectors';

export function* fetchPostsFlow(action) {
  try {
    const postsById = yield call(firestore.getPosts, action.filter);
    const ids = Object.keys(postsById);

    yield put({ type: aT.FETCH_POSTS_SUCCESS, payload: { ids, postsById } });
  } catch (error) {
    yield put({ type: aT.FETCH_POSTS_FAIL, error });
  }
}

export function* deletePostById({ payload: { id }, meta }) {
  let { wallId /* , hasTempId */ } = meta;

  if (!wallId /* || typeof hasTempId !== 'boolean' */) {
    const state = yield select();

    wallId = wallId || getWallId(state);
    // hasTempId = isPostIdTemporary(state, id);
  }

  // if (hasTempId) {
  //   yield put({ type: 'DELETE_POST_DELAY', payload: { id, wallId } });
  //   return;
  // }
  // send deletion request
  const { result, error } = yield call(firestore.deletePost, wallId, id);

  if (error) {
    yield put({
      type: aT.DELETE_POST_FAIL,
      payload: error,
      error: true,
      meta: { id },
    });
  } else {
    yield put({
      type: aT.DELETE_POST_SUCCESS,
      payload: { id },
      meta: { result }, // TEMP:
    });
  }
}

export function* createNewPost({ payload }) {
  yield call(delay, 2000);

  const state = yield select();
  const wallId = getWallId(state);
  // temporary post id, generated at client
  const tempId = payload.id; // will be removed before save to firebase
  const { id, error } = yield call(firestore.createPost, wallId, payload);

  if (error) {
    yield put({
      type: aT.ADD_POST_FAIL,
      payload: error,
      error: true,
      meta: { tempId },
    });
    // TODO: if isRemovalRequested === true -> dispatch DELETE_POST_NEEDLESS
    return;
  }
  yield put({
    type: aT.ADD_POST_SUCCESS,
    payload: { ...payload, id }, // rewrite id by one assigned at firestore
    meta: { tempId },
  });

  // check if post with id has deletion flag and invoke
  // deletePostById saga if true
  // const isRemovalRequested = yield select(isPostRemovalRequested, id);

  // if (isRemovalRequested) {
  //   yield call(deletePostById, {
  //     // type: aT.DELETE_POST,
  //     payload: { id },
  //     meta: { wallId, hasTempId: false },
  //   });
  // }
}

// export function* createPostFlow({ message }) {
//   try {
//     firestore.createPost(message);
//     yield put({ type: 'POST_CREATED', message });
//   } catch (e) {
//     console.error(e);
//   }
// }

// NOTE: can check needed part of state in watcher saga                          ???

export function* watchPostsActions() {
  yield takeEvery(aT.FETCH_POSTS, fetchPostsFlow);
  yield takeEvery(aT.ADD_POST, createNewPost);
  yield takeEvery(aT.DELETE_POST, deletePostById);
}

export default function* postsSaga() {
  yield all([watchPostsActions()]);
}
