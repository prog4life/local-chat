import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger'; // TEMP:
import reducer from 'state/reducer';

import { authSaga } from 'state/auth';
import { wallSaga } from 'state/wall';
import { postsSaga } from 'state/posts';

const sagaMiddleware = createSagaMiddleware();
// must be the last middleware in chain
// TEMP:
const logger = createLogger({
  duration: true,
  predicate: (getState, action) => {
    const hiddenTypes = [];
    return !hiddenTypes.some(type => type === action.type);
  },
});

const middlewares = [sagaMiddleware, thunk, logger]; // TEMP:
// const middlewares = [sagaMiddleware, thunk];

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
