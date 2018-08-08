import { combineReducers } from 'redux';

import {
  // LOAD_POSTS, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAIL, WEBSOCKET_CLOSED,
  FETCH_POSTS, FETCH_POSTS_SUCCESS, FETCH_POSTS_FAIL,
  JOIN_WALL, JOIN_WALL_SUCCESS, JOIN_WALL_FAIL, LEAVE_WALL, WEBSOCKET_CLOSED,
} from 'state/action-types';

import { makeUnion } from './reducerUtils';

// const initialState = {
//   postsById: {},
//   visiblePosts: [],
//   isConnecting: false,
//   isSubscribed: false,
// };

const id = (state = null, action) => {
  switch (action.type) {
    case 'FETCH_WALL_ID':
      return null;
    case 'FETCH_WALL_ID_SUCCESS':
      return action.payload;
    default:
      return state;
  }
}

const postsById = (state = null, action) => {
  switch (action.type) {
    case FETCH_POSTS: // TEMP:
      return {};
    case FETCH_POSTS_SUCCESS:
      return { ...state, ...action.payload.byId };
    default:
      return state;
  }
};

const visiblePosts = (state = null, action) => {
  switch (action.type) {
    case FETCH_POSTS: // TEMP:
      return [];
    case FETCH_POSTS_SUCCESS:
      return makeUnion(state, action.payload.ids);
    default:
      return state;
  }
};

const error = (state = null, action) => {
  switch (action.type) {
    case FETCH_POSTS_FAIL:
      return {
        ...action.error, // TEMP
        // code: action.error.code,
        // message: action.error.message,
      };
    default:
      return state;
  }
};

// attempt to subscribe to the wall
const isConnecting = (state = false, action) => {
  switch (action.type) {
    case JOIN_WALL:
      return true;
    case JOIN_WALL_SUCCESS:
    case JOIN_WALL_FAIL:
    case LEAVE_WALL:
    case WEBSOCKET_CLOSED:
      return false;
    default:
      return state;
  }
};

// TODO: change to subscriptionStatus ?
// whether this client subscribed to the wall or not
const isSubscribed = (state = false, action) => {
  switch (action.type) {
    case JOIN_WALL_SUCCESS:
      return true;
    case LEAVE_WALL:
    case WEBSOCKET_CLOSED:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  id,
  postsById,
  visiblePosts,
  error,
  isConnecting,
  isSubscribed,
});
