import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';

import { loadState, saveState } from 'utils/localStorage';
import { processAuthStateChange } from 'state/auth';
import createReduxStore from './store';

import 'bootstrap/dist/css/bootstrap.min.css';

// import 'normalize.css/normalize.css';
import 'styles/index.scss';

import 'config/firebase';
// import 'assets/favicon.png';

// import firebaseClient from './services/firebase-client';

// firebaseClient.handleAuthStateChange();
// firebaseClient.signInAnonymously();

console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

const initialState = {
  // client: {
  //   clientId: '',
  //   nickname: '',
  // },
  chats: [
    // {
    //   id: 'tfhn523'
    // },
    // {
    //   id: 'bpxv98'
    // }
  ],
  messages: [
    {
      id: 'first',
      clientId: '32425gser27408908',
      nickname: 'test user',
      text: 'Sample test user message',
      isOwn: false,
      status: 'SENT', // must be not viewed as not own
    },
    {
      id: 'scnd',
      clientId: 'wdadr27408908',
      nickname: 'Like Me',
      text: 'Whatever You want',
      isOwn: true,
      status: 'UNSENT',
    },
  ],
  whoIsTyping: '',
};

const persistedState = loadState('md-chat-state') || {};

const store = createReduxStore(initialState);

store.dispatch(processAuthStateChange());

// store.subscribe(() => console.log('New state from store: ', store.getState()));

ReactDOM.render(<App store={store} />, document.getElementById('app'));
