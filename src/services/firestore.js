import firebase from 'firebase/app';
import db from '../config/firebase';

const wallsColRef = db.collection('walls');
// const makeWallRef = wallId => wallsColRef.doc(wallId);
const makeWallRef = wallId => db.doc(`walls/${wallId}`);
const makePostsColRef = wallId => (
  makeWallRef(wallId).collection('posts')
);
const makePostDocRef = (wallId, postId) => {
  const wallRef = makeWallRef(wallId);
  return wallRef.collection('posts').doc(postId);
};

const deleteField = () => firebase.firestore.FieldValue.delete();
// TODO: rename to request/retrieve/receive/gain...
const obtainWallIdByCity = (city) => {
  // OR place, locality, location
  const wallsQuery = wallsColRef.where('city', '==', city);
  const walls = [];

  return wallsQuery.get().then((querySnapshot) => {
    // querySnapshot.docs -> array of doc's
    // querySnapshot.size -> number of doc's in query snapshot
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const wallData = doc.data(); // OR: .get(<field>)
      const wall = {
        id: doc.id, // maybe add after wallData
        ...wallData,
      };

      walls.push(wall);
    });
    console.log('obtain walls ', walls);

    return walls[0].id;
  });
};
// TODO: rename to request/retrieve...
const getPosts = (filter) => {
  const postsColRef = makePostsColRef(filter.wallId);

  // NOTE: Querying across subcollections is not currently supported in
  // Cloud Firestore. If you need to query data across collections, use
  // root-level collections.
  // TEST THIS WITH POSTS !!!

  return postsColRef.get().then((querySnapshot) => {
    const posts = {};

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const post = doc.data();
      const { id } = doc;

      posts[id] = {
        ...post,
        id,
        createdAt: post.createdAt.toMillis(),
      };
    });
    console.log('get posts ', posts);
    return posts;
  });
};

const createPost = (wallId, newPost) => {
  const postsColRef = makePostsColRef(wallId);
  const post = {
    ...newPost,
    createdAt: firebase.firestore.Timestamp.fromMillis(newPost.createdAt),
  };
  delete post.id; // remove temporary id, generated at client

  // if need to use document rigth after creation:
  // Add a new document with a generated id.
  //    const newWallRef = db.collection('walls').doc();
  // use it later...
  //    newWallRef.set({ any: 'data' });
  // .add(...) and .doc().set(...) are completely equivalent                     !!!

  // will generate new id for created post
  return postsColRef.add(post) // => settles with docRef (new id: docRef.id)
    .then(
      newPostRef => ({ id: newPostRef.id }),
      error => ({ error }),
    );
};

const deletePost = (wallId, postId) => {
  const postRef = makePostDocRef(wallId, postId);

  return postRef.delete().catch(error => ({ error }));
};

const updatePost = (message) => {
  const wallDocRef = db.collection('walls').doc('VmQhK1Bg5HFKnLMr6hZw');
  const postRef = wallDocRef.collection('posts').doc('pVfcP0Bhf44hTljJ0Yf6');

  postRef.set({ text: message }, { merge: true });
};

// TODO: try to get wall with where() and add subscribe to it within single query

const subscribeToWall = ({ clientUid, wallId }) => {
  return makeWallRef(wallId).set(
    { subscribers: { [clientUid]: true } },
    { merge: true },
  );
};

// const subscribeToWall = async (uid) => {
//   db.runTransaction((transaction) => {
//     // This code may get re-run multiple times if there are conflicts.
//     return transaction.

//   });
// };

const unsubscribeFromWall = (uid) => {
  return makeWallRef('VmQhK1Bg5HFKnLMr6hZw').set(
    { subscribers: { [uid]: true } },
    { merge: true },
  ).then(
    result => console.log('Unsubsribe from wall result: ', result),
    error => console.error(error),
  );
};

export {
  getPosts, createPost, deletePost, updatePost,
  obtainWallIdByCity, subscribeToWall, unsubscribeFromWall, db as default,
};

// TODO: export each function separately +
// export default {
//   getPosts,
//   createPost,
//   updatePost,
//   subscribeToWall,
// };
