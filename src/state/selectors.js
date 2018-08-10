// import { createSelector } from 'reselect';

// client state slice
export const getUid = state => state.client.uid;
export const isAnonymousSelector = state => state.client.isAnonymous;

// wall state slice
export const getWallId = state => state.wall.id;
export const isSubscribedToWall = state => state.wall.isSubscribed;
export const isSubscribingToWall = state => state.wall.isSubscribing;

// posts state slice
export const getPosts = (state) => {
  const { postsById } = state.posts;
  // const ids = postsById ? Object.keys(postsById) : [];

  return postsById
    // was ids.map(id => postsById[id])
    ? Object.values(postsById).filter(post => (
      !state.posts.toBeRemoved.includes(post.id)
    ))
    : null;
};
export const isFetchingPosts = state => state.posts.isFetching;
export const getDeletedPosts = state => state.posts.toBeRemoved;
export const isPostRemovalRequested = (state, id) => (
  state.posts.toBeRemoved.includes(id)
);

// chats state slice
export const getChats = state => state.chats;

// websocket state slice
export const isConnectionOpen = state => state.websocket.isOpen;
