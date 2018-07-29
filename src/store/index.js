const createReduxStore = process.env.NODE_ENV === 'production'
  ? require('./create-redux-store.prod')
  : require('./create-redux-store.dev');

export default createReduxStore.default;
