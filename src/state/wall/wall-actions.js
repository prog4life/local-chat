import {
  JOIN_WALL, JOIN_WALL_SUCCESS, JOIN_WALL_FAIL, LEAVE_WALL,
} from 'state/action-types';

export const joinWall = () => ({ type: JOIN_WALL });
export const leaveWall = () => ({ type: LEAVE_WALL });
export const joinWallFail = () => ({ type: JOIN_WALL_FAIL });

export const joinWallSuccess = ({ entities, result }) => ({
  type: JOIN_WALL_SUCCESS,
  payload: { byId: entities.posts, ids: result },
});

export const createPost = message => ({
  type: 'CREATE_POST',
  message,
});
