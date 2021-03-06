import firebase from 'firebase/app';

const auth = () => firebase.auth();

// TODO: use getters

const firebaseClient = {
  signInAnonymously() {
    return auth().signInAnonymously().catch((error) => {
      // Handle Errors here.
      // ...
      throw error;
    });
  },
  signInWithEmail(email, password) {
    return auth().signInWithEmailAndPassword(email, password)
      .catch((error) => {
        // Handle Errors here.
        console.error(`Sign In with email error, code: ${error.code}, `
          + `message: ${error.message}`);
        // ...
        throw error;
      });
  },
  signOut() {
    return auth().signOut();
  },
  getEmailCredential(email, password) {
    return auth().EmailAuthProvider.credential(email, password);
  },
  linkAccount(credential) {
    return Promise.resolve(credential);
    // auth().currentUser.linkAndRetrieveDataWithCredential(credential)
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
      auth().onAuthStateChanged((user) => {
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
    // return auth().onAuthStateChanged((user) => {
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
};

// TODO: export as function that => firebase.auth()
export default firebaseClient;
