import firebase from 'firebase/app';
import db from '../config/firebase';

const wallsRef = db.collection('walls');
// const wallRef = wallId => wallsRef.doc(wallId);
const wallRef = wallId => db.doc(`walls/${wallId}`);
const postsRef = wallId => (
  wallRef(wallId).collection('posts')
);

const deleteField = () => firebase.firestore.FieldValue.delete();
// TODO: rename to request/retrieve...
const getWallsByCity = (city) => {
  // OR place, locality, location
  const wallsQuery = wallsRef.where('city', '==', city);
  const walls = [];

  return wallsQuery.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const wallData = doc.data();
      const wall = {
        id: doc.id, // maybe add after wallData
        ...wallData,
      };

      walls.push(wall);
    });
    console.log('walls ', walls);
    return walls;
  });
};
// TODO: rename to request/retrieve...
const getPosts = (filter) => {
  const postsColRef = postsRef(filter.wallId);

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
    console.log('posts ', posts);
    return posts;
  });
};

const createPost = (message) => {
  const wallDocRef = db.collection('walls').doc('VmQhK1Bg5HFKnLMr6hZw');
  const postRef = wallDocRef.collection('posts').doc('pVfcP0Bhf44hTljJ0Yf6');

  // will generate new id for created post
  postRef.add({ text: message }); // => settles with docRef (new id: docRef.id)

  // if need to use document rigth after creation:
  // Add a new document with a generated id.
  const newWallRef = db.collection('walls').doc();
  // use it later...
  newWallRef.set({ any: 'data' });
  // .add(...) and .doc().set(...) are completely equivalent                     !!!
};

const updatePost = (message) => {
  const wallDocRef = db.collection('walls').doc('VmQhK1Bg5HFKnLMr6hZw');
  const postRef = wallDocRef.collection('posts').doc('pVfcP0Bhf44hTljJ0Yf6');

  postRef.set({ text: message }, { merge: true });
};

const subscribeToWall = ({ clientUid, wallId }) => {
  return wallRef(wallId).set(
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
  return wallRef('VmQhK1Bg5HFKnLMr6hZw').set(
    { subscribers: { [uid]: true } },
    { merge: true },
  ).then(
    result => console.log('Unsubsribe from wall result: ', result),
    error => console.error(error),
  );
}

export {
  wallsRef, wallRef, postsRef, getPosts, createPost, updatePost,
  getWallsByCity, subscribeToWall, unsubscribeFromWall, db as default,
};

// TODO: export each function separately +
// export default {
//   wallsRef,
//   wallRef,
//   postsRef,
//   getPosts,
//   createPost,
//   updatePost,
//   subscribeToWall,
// };
