import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import immutabilityWatcher from 'redux-immutable-state-invariant';
import freeze from 'redux-freeze';
import { createLogger } from 'redux-logger';
import createWebsocketMiddleware from 'redux-mw-ws';
// import logger from 'redux-logger'; // to get logger mw with default options
import appReducer from 'reducers';

import createWebsocketHelper from 'middleware/websocketHelper';
import { websocketMessageHandlers } from 'actions';
import { wallSaga } from 'state/wall';

const sagaMiddleware = createSagaMiddleware();
// must be the last middleware in chain
const logger = createLogger({
  duration: true,
  predicate: (getState, action) => {
    const hiddenTypes = [];
    return !hiddenTypes.some(type => type === action.type);
  },
});

// args: 1st - options, 2nd - reconnectCallback
const websocketMw = createWebsocketMiddleware({
  defaultEndpoint: 'ws://localhost:8787',
});
const websocketHelper = createWebsocketHelper(websocketMessageHandlers);

const watcher = immutabilityWatcher();

const middleware = process.env.NODE_ENV === 'development'
  ? [watcher, freeze, /* websocketHelper,  websocketMw, */ sagaMiddleware, thunk, logger]
  : [thunk];

const createReduxStore = (preloadedState = {}) => {
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    || compose;

  const store = createStore(
    appReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware)),
  );

  sagaMiddleware.run(wallSaga);

  return store;
};

export default createReduxStore;
