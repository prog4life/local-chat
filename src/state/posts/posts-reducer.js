import { combineReducers } from 'redux';
import { combineActions } from 'redux-actions';

import * as aT from 'state/action-types';

import { createReducer, addIfNotExist, makeUnion, setErrorValue } from 'state/utils';

const postsById = (state = null, action) => {
  switch (action.type) {
    case aT.FETCH_POSTS:
      return state === null ? {} : state;
    case aT.FETCH_POSTS_SUCCESS:
      return { ...state, ...action.payload.byId };
    case aT.ADD_POST:
      // this id will be temporary
      return { ...state, [action.payload.id]: { ...action.payload } };
    case aT.ADD_POST_SUCCESS: {
      const nextState = { ...state };
      nextState[action.payload.id] = {
        // retrieve data from post object that is stored under temporary id
        ...nextState[action.meta.tempId], // temp id will be rewrited by ->
        ...action.payload, // contains permanent id assigned by firestore
      };
      delete nextState[action.meta.tempId];
      return nextState;
    }
    case aT.ADD_POST_FAIL: {
      const nextState = { ...state };
      delete nextState[action.meta.tempId];
      return nextState;
    }
    case aT.DELETE_POST_SUCCESS: {
      const nextState = { ...state };
      delete nextState[action.payload.id];
      return nextState;
    }
    default:
      return state;
  }
};

// to store posts data temporarily until operation result (success/fail)
const undo = createReducer({
  [aT.DELETE_POST]: (state, { payload }) => ({
    ...state,
    deleted: addIfNotExist(state.deleted, payload.id),
  }),
  [combineActions(
    aT.DELETE_POST_SUCCESS,
    aT.DELETE_POST_FAIL,
  )]: (state, { payload }) => ({
    ...state,
    deleted: state.deleted.filter(id => id !== payload.id),
  }),
}, { deleted: [], updated: {} });

// when post removal starts its id is landed here until deletion success or fail
// const toBeRemoved = (state = [], action) => {
//   switch (action.type) {
//     case aT.DELETE_POST:
//       return addIfNotExist(state, action.payload.id);
//     case aT.DELETE_POST_SUCCESS:
//     case aT.DELETE_POST_FAIL:
//       return state.filter(id => id !== action.payload.id);
//     default:
//       return state;
//   }
// };

const isFetching = (state = false, action) => {
  switch (action.type) {
    case aT.FETCH_POSTS:
      return true;
    case aT.FETCH_POSTS_SUCCESS:
    case aT.FETCH_POSTS_FAIL:
      return false;
    default:
      return state;
  }
};

const visiblePosts = (state = null, action) => {
  switch (action.type) {
    case aT.FETCH_POSTS:
      return state === null ? [] : state;
    case aT.FETCH_POSTS_SUCCESS:
      return makeUnion(state, action.payload.ids);
    default:
      return state;
  }
};

const initialErrorsState = {
  fetching: null, add: null, delete: null, update: null,
};

const errors = (state = initialErrorsState, action) => {
  switch (action.type) {
    case aT.FETCH_POSTS:
      return setErrorValue(state, 'fetching');
    case aT.FETCH_POSTS_FAIL:
      return setErrorValue(state, 'fetching', action.error);
    case aT.ADD_POST:
      return setErrorValue(state, 'add');
    case aT.ADD_POST_FAIL:
      return setErrorValue(state, 'add', action.error);
    case aT.DELETE_POST:
      return setErrorValue(state, 'delete');
    case aT.DELETE_POST_FAIL:
      return setErrorValue(state, 'delete', action.error);
    default:
      return state;
  }
};

export default combineReducers({
  postsById,
  undo,
  // toBeRemoved,
  isFetching,
  visiblePosts,
  errors,
});
