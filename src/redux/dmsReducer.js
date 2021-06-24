import { createSlice } from '@reduxjs/toolkit';

export const dmsSlice = createSlice({
  name: 'dms',
  initialState: {
    openedChat: "",


    chats: {},

    requesting: [],
    requested: [],
    requested_me: [],
    already_requested: [],
    chat_exists: []
  },
  reducers: {
    setopenedChat: (state, action) => {
      state.openedChat = action.payload;
    },
    addChat: (state, action) => {
      state.chats[action.payload] = {messages: null, lastRead: {me: null, them: null}};
    },
    addMessage: (state, action) => {
      let myChatEmail = state.openedChat;
      if ("chat" in action.payload) {
        myChatEmail = action.payload["chat"];
      }

      let myMessages = state.chats[myChatEmail]["messages"];
      if (myMessages == null) {
        myMessages = [];
      }

      let myId = 0;
      if ("id" in action.payload) {
        myId = action.payload["id"];
      } else {
        if (myMessages.length > 0) {
          myId = myMessages[myMessages.length - 1]["id"] + 1;
        }
      }
      let myFrom = "me";
      if ("from" in action.payload) {
        myFrom = action.payload["from"];
      }
      const newMessage = {message: action.payload["message"], from: myFrom, id: myId, timestamp: action.payload["timestamp"]};
      myMessages.push(newMessage);
      state.chats[myChatEmail]["messages"] = myMessages;
    },
    addSendingMessage: (state, action) => {
      let myChatEmail = state.openedChat;
      if ("chat" in action.payload) {
        myChatEmail = action.payload["chat"];
      }

      let mySendingMessages = state.chats[myChatEmail]["sendingMessages"];
      if (mySendingMessages != null) {
        mySendingMessages.push(action.payload["message"]);
        state.chats[myChatEmail]["sendingMessages"] = mySendingMessages;
      } else {
        state.chats[myChatEmail]["sendingMessages"] = [action.payload["message"]];
      }
    },
    removeSendingMessage: (state, action) => {
      let myChatEmail = state.openedChat;
      if ("chat" in action.payload) {
        myChatEmail = action.payload["chat"];
      }

      let mySendingMessages = state.chats[myChatEmail]["sendingMessages"];
      var index = mySendingMessages.indexOf(action.payload["message"]);
      if (index > -1) {
        mySendingMessages.splice(index, 1);
      }
      state.chats[myChatEmail]["sendingMessages"] = mySendingMessages;
    },

    setCreated: (state, action) => {
      let myChatEmail = state.openedChat;
      if ("chat" in action.payload) {
        myChatEmail = action.payload["chat"];
      }

      state.chats[myChatEmail].created = action.payload.created;
    },
    setTempMessageInput: (state, action) => {
      state.chats[action.payload["chat"]].tempMessageInput = action.payload["input"];
    },
    setLastRead: (state, action) => {
      if (action.payload["who"] == "me") {
        state.chats[action.payload["chat"]].lastRead.me = action.payload["lastRead"];
      } else if (action.payload["who"] == "them") {
        state.chats[action.payload["chat"]].lastRead.them = action.payload["lastRead"];
      }
    },
    setTyping: (state, action) => {
      state.chats[action.payload["chat"]].typing = action.payload["data"];
    },
    setInChat: (state, action) => {
      state.chats[action.payload["chat"]].inChat = action.payload["data"];
    },

    addRequest: (state, action) => {
      if (!state[action.payload["type"]].includes(action.payload)) {
        state[action.payload["type"]].push(action.payload["email"]);
      }
    },
    removeRequest: (state, action) => {
      var index = state[action.payload["type"]].indexOf(action.payload["email"]);
      if (index > -1) {
        state[action.payload["type"]].splice(index, 1);
      }
    },
  },
});

export const { setopenedChat, addChat, addMessage, addSendingMessage, removeSendingMessage,
  setCreated, setTempMessageInput, setLastRead, setTyping, setInChat,
  addRequest, removeRequest
 } = dmsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.app.name)`
export const getopenedChat = state => state.dms.openedChat;
export const getChats = state => state.dms.chats;
export const getRequested = state => state.dms.requested;
export const getRequestedMe = state => state.dms.requestedMe;

export default dmsSlice.reducer;
