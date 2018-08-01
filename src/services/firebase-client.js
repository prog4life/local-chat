import firebase from 'firebase';
import db from '../config/firebase';

const auth = () => firebase.auth();

const firebaseClient = {
  signInAnonymously() {
    return firebase.auth().signInAnonymously().catch((error) => {
      // Handle Errors here.
      // ...
      throw error;
    });
  },
  signInWithEmail(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((error) => {
        // Handle Errors here.
        console.error(`Sign In with email error, code: ${error.code}, `
          + `message: ${error.message}`);
        // ...
        throw error;
      });
  },
  signOut() {
    return firebase.auth().signOut();
  },
  getEmailCredential(email, password) {
    return firebase.auth.EmailAuthProvider.credential(email, password);
  },
  linkAccount(credential) {
    return Promise.resolve(credential);
    // firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential)
    //   .then(
    //     (usercred) => {
    //       const { user } = usercred;
    //       console.log('Anonymous account successfully upgraded', user);
    //     },
    //     (error) => {
    //       console.log('Error upgrading anonymous account', error);
    //     },
    //   );
  },
  handleAuthStateChange() {
    // eslint-disable-next-line compat/compat
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in.
          const { isAnonymous, uid, displayName, email } = user;
          const { emailVerified, photoURL, providerData } = user;

          console.log('Signed In USER uid: ', uid);
        } else {
          // User is signed out.
          console.log('User is signed out');
        }
        resolve({ user });
      }, (error) => {
        console.error('Auth state change ERROR: ', error);
        resolve({ error });
      });
    });
    // return firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     // User is signed in.
    //     const { isAnonymous, uid } = user;
    //     const {
    //       displayName, email, emailVerified, photoURL, providerData,
    //     } = user;
    //
    //     console.log('Signed In USER uid: ', uid);
    //     onSignIn(user);
    //   } else {
    //     // User is signed out.
    //     console.log('User is signed out');
    //     onSignOut();
    //   }
    // }, (error) => {
    //   onError(error);
    // });
  },
  createPost(message) {
    const wallDocRef = db.collection('walls').doc('VmQhK1Bg5HFKnLMr6hZw');
    const postRef = wallDocRef.collection('posts').doc('pVfcP0Bhf44hTljJ0Yf6');

    postRef.set({ text: message });
  },
  async subscribeToWall() {
    const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

    await delay(2000);

    return Math.random() * 10 > 3
      ? Promise.resolve({ success: true, response: 'OK' })
      : Promise.reject(new Error('Sample rejection'));
    /* to be implemented */
  },
};

export default firebaseClient;
