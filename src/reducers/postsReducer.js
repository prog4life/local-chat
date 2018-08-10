import { combineReducers } from 'redux';

import * as aT from 'state/action-types';

import { addIfNotExist, makeUnion } from './reducerUtils';

const postsById = (state = null, action) => {
  switch (action.type) {
    case aT.FETCH_POSTS: // TEMP:
      return {};
    case aT.FETCH_POSTS_SUCCESS:
      return { ...state, ...action.payload.byId };
    case aT.ADD_POST:
      return { ...state, [action.payload.id]: { ...action.payload } };
    case aT.ADD_POST_SUCCESS: {
      const nextState = { ...state };
      nextState[action.payload.id] = {
        // retrieve data from post object stored under temp id
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
    case aT.DELETE_POST_SUCCESS:
      const nextState = { ...state };
      delete nextState[action.payload.id];
      return nextState;
    default:
      return state;
  }
};

// on delete post its id is landed here until deletion success or fail
const toBeRemoved = (state = [], action) => {
  switch (action.type) {
    case aT.DELETE_POST:
      return addIfNotExist(state, action.payload.id);
    case aT.DELETE_POST_SUCCESS:
    case aT.DELETE_POST_FAIL:
      return state.filter(id => id !== action.payload.id);
    default:
      return state;
  }
};

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
    case aT.FETCH_POSTS: // TEMP:
      return [];
    case aT.FETCH_POSTS_SUCCESS:
      return makeUnion(state, action.payload.ids);
    default:
      return state;
  }
};

const errors = (state = { fetching: null }, action) => {
  switch (action.type) {
    case aT.FETCH_POSTS:
      return { ...state, fetching: null };
    case aT.FETCH_POSTS_FAIL:
      return {
        ...state,
        fetching: { ...action.error }, // TEMP
        // fetching: {
        //   code: action.error.code,
        //   message: action.error.message,
        // },
      };
    default:
      return state;
  }
};

export default combineReducers({
  postsById,
  toBeRemoved,
  isFetching,
  visiblePosts,
  errors,
});