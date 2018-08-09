import { call, put, takeEvery, select, all } from 'redux-saga/effects';
import * as aT from 'state/action-types';
import * as firestore from 'services/firestore';
import { getWallId } from 'state/selectors';

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

// export function* createPostFlow({ message }) {
//   try {
//     firestore.createPost(message);
//     yield put({ type: 'POST_CREATED', message });
//   } catch (e) {
//     console.error(e);
//   }
// }

export function* watchPostsActions() {
  yield takeEvery(aT.ADD_POST, createNewPost);
}

export default function* postsSaga() {
  yield all([watchPostsActions()]);
}