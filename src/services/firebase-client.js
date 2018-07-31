import firebase from 'firebase';

const firebaseClient = {
  auth() {
    return firebase.auth();
  },
  signInAnonymously() {
    return firebase.auth().signInAnonymously().catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
      console.error(`Anonymous Sign In error, code: ${errorCode}, `
        + `message: ${errorMessage}`);

      throw error;
    });
  },
  signInWithEmail(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
        console.error(`Sign In with email error, code: ${errorCode}, `
          + `message: ${errorMessage}`);

        throw error;
      });
  },
  signOut() {
    return firebase.auth().signOut();
  },
  handleAuthStateChange() {
    // eslint-disable-next-line compat/compat
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in.
          const { isAnonymous, uid } = user;
          const {
            displayName, email, emailVerified, photoURL, providerData,
          } = user;

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
  async subscribeToWall() {
    const delay = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

    await delay(2000);

    return Math.random() * 10 > 4
      ? Promise.resolve({ success: true, response: 'OK' })
      : Promise.reject(new Error('Sample rejection'));
    /* to be implemented */
  },
};

export default firebaseClient;
