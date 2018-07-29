import firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyAT9-GhTwEB2VX6XOsXTiXeZs_5a7Shkqc',
  authDomain: 'local-chat-3823b.firebaseapp.com',
  databaseURL: 'https://local-chat-3823b.firebaseio.com',
  projectId: 'local-chat-3823b',
  storageBucket: 'local-chat-3823b.appspot.com',
  messagingSenderId: '798724513812',
};

firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();

db.collection('walls').get()
  .then(querySnapshot => querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  }))
  .catch(e => console.error(e));
