import { combineReducers } from 'redux';

import client from './clientReducer';
import chats from './chatsReducer';
import messages from './messagesReducer';
import wall from './wallReducer';
import websocket from './websocketReducer';
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
  websocket,
});

export const getClientId = state => state.client.id;
export const getUid = state => state.client.uid;
export const getChats = state => state.chats;
export const getPosts = state => Object.values(state.wall.postsById);
export const isConnectionOpen = state => state.websocket.isOpen;
export const isSubscribedToWall = state => state.wall.isSubscribed;
export const isConnectingToWall = state => state.wall.isConnecting;
