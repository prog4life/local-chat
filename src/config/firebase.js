import firebase from 'firebase/app';
import 'firebase/auth';
// Required for side-effects
import 'firebase/firestore'; // ???

import ReduxSagaFirebase from 'redux-saga-firebase'

// TODO: upload keys and params from env vars                                    !!!

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyAT9-GhTwEB2VX6XOsXTiXeZs_5a7Shkqc',
  authDomain: 'local-chat-3823b.firebaseapp.com',
  databaseURL: 'https://local-chat-3823b.firebaseio.com',
  projectId: 'local-chat-3823b',
  storageBucket: 'local-chat-3823b.appspot.com',
  messagingSenderId: '798724513812',
};

const firebaseApp = firebase.initializeApp(config);

// TODO: Replace to firestore ?
// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();
const configuration = { timestampsInSnapshots: true };
db.settings(configuration);

export const reduxSagaFirebase = new ReduxSagaFirebase(firebaseApp); // rsf

/*
// Old:
const date = snapshot.get('created_at');
// New:
const timestamp = snapshot.get('created_at');
const date = timestamp.toDate();
*/

db.collection('walls').get()
  .then(querySnapshot => querySnapshot.forEach((doc) => {
    console.log('wall ', doc.id, ' => ', doc.data());
  }))
  .catch(e => console.error(e));

export default db;
