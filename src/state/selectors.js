import { createSelector } from 'reselect';

// Beware of problem with selector which returns a new object everytime,         !!!
// and that will violate the shallow comparison in "connect"

// auth state slice
export const getUid = state => state.auth.uid;
export const isAnonymousSelector = state => state.auth.isAnonymous;

// wall state slice
export const getWallId = state => state.wall.id;
export const isSubscribedToWall = state => state.wall.isSubscribed;
export const isSubscribingToWall = state => state.wall.isSubscribing;

// posts state slice
export const getPostsById = state => state.posts.postsById;
export const getPostById = (state, id) => getPostsById(state)[id];
export const getPostIds = state => state.posts.listedIds;
export const getPosts = createSelector(
  [getPostsById, getPostIds],
  (postsById, ids) => (
    postsById && ids
      // const ids = postsById ? Object.keys(postsById) : [];
      // was !deletedPosts.includes(post.id)
      ? ids.map(id => postsById[id]).filter(post => !post.isDeleted)
      : null
  ),
);
// PRIOR version
// WARNING: it returns new object each time, so shalow equal in connect fails
// export const getPosts = (state) => {
//   const { postsById } = state.posts;
//   // const ids = postsById ? Object.keys(postsById) : [];
//
//   return postsById
//     // was ids.map(id => postsById[id])
//     ? Object.values(postsById).filter(post => (
//       !getDeletedPosts(state).includes(post.id)
//     ))
//     : null;
// };
export const isFetchingPosts = state => state.posts.isFetching;
export const isPostIdTemporary = (state, id) => getPostById(state, id).hasTempId;
export const isPostRemovalRequested = (state, id) => (
  getPostById(state, id).isDeleted
);

// chats state slice
export const getChats = state => state.chats;
