import { combineReducers } from 'redux';

import client from './clientReducer';
import chats from './chatsReducer';
import messages from './messagesReducer';
import wall from './wallReducer';

import {
  // nickname,
  // clientId,
  whoIsTyping,
  unsent,
} from './reducers';

// exporting of rootReducer
export default combineReducers({
  client,
  // nickname,
  // clientId,
  chats,
  messages,
  wall,
  whoIsTyping,
  unsent,
});
