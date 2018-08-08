import {
  JOIN_WALL, JOIN_WALL_SUCCESS, JOIN_WALL_FAIL, LEAVE_WALL, FETCH_POSTS,
} from 'state/action-types';

export const joinWall = (clientUid, wallId) => ({
  type: JOIN_WALL,
  payload: { clientUid, wallId },
});
export const leaveWall = () => ({ type: LEAVE_WALL });
export const joinWallFail = () => ({ type: JOIN_WALL_FAIL });

export const joinWallSuccess = ({ entities, result }) => ({
  type: JOIN_WALL_SUCCESS,
  payload: { byId: entities.posts, ids: result },
});

export const fetchWallId = city => ({ type: 'FETCH_WALL_ID', city });

export const fetchPosts = filter => ({ type: FETCH_POSTS, filter });

export const createPost = message => ({
  type: 'CREATE_POST',
  message,
});
