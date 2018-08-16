import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import immutabilityWatcher from 'redux-immutable-state-invariant';
import freeze from 'redux-freeze';
import { createLogger } from 'redux-logger';
// import logger from 'redux-logger'; // to get logger mw with default options
import reducer from 'state/reducer';

import { authSaga } from 'state/auth';
import { wallSaga } from 'state/wall';
import { postsSaga } from 'state/posts';

const sagaMiddleware = createSagaMiddleware();
// must be the last middleware in chain
const logger = createLogger({
  duration: true,
  predicate: (getState, action) => {
    const hiddenTypes = [];
    return !hiddenTypes.some(type => type === action.type);
  },
});

const watcher = immutabilityWatcher();

const middlewares = process.env.NODE_ENV === 'development' // TEMP: doublecheck
  ? [watcher, freeze, sagaMiddleware, thunk, logger]
  : [sagaMiddleware, thunk];

const createReduxStore = (preloadedState = {}) => {
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    || compose;

  const store = createStore(
    reducer,
    preloadedState,
    composeEnhancers(applyMiddleware(...middlewares)),
  );

  sagaMiddleware.run(authSaga);
  sagaMiddleware.run(wallSaga);
  sagaMiddleware.run(postsSaga);

  return store;
};

export default createReduxStore;
