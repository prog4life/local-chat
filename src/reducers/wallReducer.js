import { combineReducers } from 'redux';

import * as aT from 'state/action-types';

import { makeUnion } from './reducerUtils';

// const initialState = {
//   postsById: {},
//   visiblePosts: [],
//   isSubscribing: false,
//   isSubscribed: false,
// };

const id = (state = null, action) => {
  switch (action.type) {
    case aT.FETCH_WALL_ID:
      return null;
    case aT.FETCH_WALL_ID_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

const postsById = (state = null, action) => {
  switch (action.type) {
    case aT.FETCH_POSTS: // TEMP:
      return {};
    case aT.FETCH_POSTS_SUCCESS:
      return { ...state, ...action.payload.byId };
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
}

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

const errors = (state = { posts: null, wallId: null }, action) => {
  switch (action.type) {
    case aT.FETCH_POSTS:
      return { ...state, posts: null };
    case aT.FETCH_WALL_ID:
      return { ...state, wallId: null };
    case aT.FETCH_POSTS_FAIL:
      return {
        ...state,
        posts: { ...action.error }, // TEMP
        // posts: {
        //   code: action.error.code,
        //   message: action.error.message,
        // },
      };
    case aT.FETCH_WALL_ID_FAIL:
      return {
        ...state,
        wallId: { ...action.error }, // TEMP
        // wallId: {
        //   code: action.error.code,
        //   message: action.error.message,
        // },
      }
    default:
      return state;
  }
};

// state of subscription to the wall request
const isSubscribing = (state = false, action) => {
  switch (action.type) {
    case aT.JOIN_WALL:
      return true;
    case aT.JOIN_WALL_SUCCESS:
    case aT.JOIN_WALL_FAIL:
    case aT.LEAVE_WALL:
      return false;
    default:
      return state;
  }
};

// whether this client subscribed to the wall or not
const isSubscribed = (state = false, action) => {
  switch (action.type) {
    case aT.JOIN_WALL_SUCCESS:
      return true;
    case aT.LEAVE_WALL:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  id,
  postsById,
  isFetching,
  visiblePosts,
  errors,
  isSubscribing,
  isSubscribed,
});
