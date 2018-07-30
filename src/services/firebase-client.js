import firebase from 'firebase';

const firebaseClient = {
  signInAnonymously() {
    return firebase.auth().signInAnonymously().catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
      console.error(`Got error, code: ${errorCode}, message: ${errorMessage}`);

      throw error;
    });
  },
  handleAuthStateChange() {
    // eslint-disable-next-line compat/compat
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in.
          const { isAnonymous, uid } = user;

          console.log('Signed In USER uid: ', uid);
        } else {
          // User is signed out.
          console.log('User is signed out');
        }
        resolve(user || null);
      }, (error) => {
        reject(error);
      });
    });
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
