import { combineReducers } from 'redux';

import * as aT from 'state/action-types';

// const login = (state = '', action) => {
//   switch (action.type) {
//     case aT.SET_LOGIN:
//       return action.login;
//     default:
//       return state;
//   }
// };

const uid = (state = null, action) => {
  switch (action.type) {
    case aT.SIGN_IN:
      return null;
    case aT.SIGN_IN_SUCCESS:
      return action.payload.uid;
    case aT.SIGN_IN_FAILURE:
    case aT.SIGN_OUT:
      return null;
    default:
      return state;
  }
};

const isAnonymous = (state = null, action) => {
  switch (action.type) {
    case aT.SIGN_IN:
      return null;
    case aT.SIGN_IN_SUCCESS:
      return (action.payload.uid && action.payload.isAnonymous) || false;
    case aT.SIGN_IN_FAILURE:
    case aT.SIGN_OUT:
      return null;
    default:
      return state;
  }
};

const id = (state = '', action) => {
  switch (action.type) {
    case aT.SET_CLIENT_ID:
      return action.clientId;
    default:
      return state;
  }
};

const token = (state = '', action) => {
  switch (action.type) {
    case aT.SET_TOKEN:
      return action.token;
    default:
      return state;
  }
};

const nickname = (state = '', action) => {
  switch (action.type) {
    case aT.SET_NICKNAME:
      return action.nickname;
    default:
      return state;
  }
};

export default combineReducers({
  // login,
  uid,
  isAnonymous,
  id,
  token,
  nickname,
});
