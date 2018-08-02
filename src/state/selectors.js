// import { createSelector } from 'reselect';

// client state slice
export const getClientId = state => state.client.id;
export const getUid = state => state.client.uid;
export const isAnonymousSelector = state => state.client.isAnonymous;

// wall state slice
export const getPosts = (state) => {
  const { postsById } = state.wall;
  // const ids = postsById ? Object.keys(postsById) : [];

  return postsById
    // ? ids.map(id => ({ ...postsById[id], id })) // inject id into post object
    ? Object.values(postsById) // OR: ids.map(id => postsById[id])
    : null;
};
export const isSubscribedToWall = state => state.wall.isSubscribed;
export const isConnectingToWall = state => state.wall.isConnecting;

// chats state slice
export const getChats = state => state.chats;

// websocket state slice
export const isConnectionOpen = state => state.websocket.isOpen;
