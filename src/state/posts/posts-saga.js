import { call, put, takeEvery, select, all } from 'redux-saga/effects';
import * as aT from 'state/action-types';
import * as firestore from 'services/firestore';
import { getWallId, isPostRemovalRequested } from 'state/selectors';

export function* fetchPostsFlow(action) {
  try {
    const posts = yield call(firestore.getPosts, action.filter);
    const ids = Object.keys(posts);

    yield put({ type: aT.FETCH_POSTS_SUCCESS, payload: { ids, byId: posts } });
  } catch (error) {
    yield put({ type: aT.FETCH_POSTS_FAIL, error });
  }
}

export function* createNewPost(action) {
  const state = yield select();
  const wallId = getWallId(state);
  const tempId = action.payload.id; // will be removed before save to firebase
  const result= yield call(firestore.createPost, wallId, action.payload);
  
  if (result.error) {
    yield put({
      type: aT.ADD_POST_FAIL,
      error: result.error,
      meta: { tempId },
    });
  }
  yield put({
    type: aT.ADD_POST_SUCCESS,
    payload: result, // result will include post id assigned by firestore
    meta: { tempId }, // temporary post id, generated at client
  });
}

export function* deletePostById({ payload: { id }}) {
  const state = yield select();
  const isRemovalRequested = isPostRemovalRequested(state, id);

  if (isRemovalRequested) {
    console.log('Post deletion command is sent already, id: ', id);
    return;
  }
  console.log('Sending post deletion command to firestore, id: ', id);
}

// export function* createPostFlow({ message }) {
//   try {
//     firestore.createPost(message);
//     yield put({ type: 'POST_CREATED', message });
//   } catch (e) {
//     console.error(e);
//   }
// }

export function* watchPostsActions() {
  yield takeEvery(aT.FETCH_POSTS, fetchPostsFlow);
  yield takeEvery(aT.ADD_POST, createNewPost);
  yield takeEvery(aT.DELETE_POST, deletePostById);
}

export default function* postsSaga() {
  yield all([watchPostsActions()]);
}