import db from '../config/firebase';

const wallsRef = db.collection('walls');
// const wallRef = wallId => wallsRef.doc(wallId);
const wallRef = wallId => db.doc(`walls/${wallId}`);
const postsRef = () => (
  wallRef('VmQhK1Bg5HFKnLMr6hZw').collection('posts')
);

const getPosts = () => {
  const postsColRef = postsRef();

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

  postRef.add({ text: message });
  // if need to use it rigth after creation:
  // .add(...) and .doc().set(...) are completely equivalent                     !!!
  // Add a new document with a generated id.
  const newWallRef = db.collection('walls').doc();

  // later...
  newWallRef.set({ any: 'data' });
};

const updatePost = (message) => {
  const wallDocRef = db.collection('walls').doc('VmQhK1Bg5HFKnLMr6hZw');
  const postRef = wallDocRef.collection('posts').doc('pVfcP0Bhf44hTljJ0Yf6');

  postRef.set({ text: message }, { merge: true });
};

const subscribeToWall = async () => {
  const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

  await delay(2000);

  return Math.random() * 10 > 3
    ? Promise.resolve({ success: true, response: 'OK' })
    : Promise.reject(new Error('Sample rejection'));
  /* to be implemented */
};

export {
  wallsRef, wallRef, postsRef, getPosts, createPost, updatePost,
  subscribeToWall, db as default,
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
