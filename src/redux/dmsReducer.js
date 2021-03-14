import { createSlice } from '@reduxjs/toolkit';

export const dmsSlice = createSlice({
  name: 'dms',
  initialState: {
    openedChat: "",


    chats: {
      /*"ethanflynn2007@gmail.com": {
        messages: [
          {message: "heh heh", from: "me", id: 14},
          {message: "ha ha", from: "me", id: 15},
          {message: "ehhhh", from: "me", id: 16},
          {message: "lololol", from: "me", id: 17},
          {message: "what?", from: "them", id: 18},
          {message: "nothing", from: "me", id: 19},
          {message: "ok", from: "them", id: 20},
          {message: "werido", from: "them", id: 21},
          {message: "bruh", from: "me", id: 22},
        ],
        sendingMessages: [
          "Heya, brah. This message is sending."
        ],
        tempMessageInput: "",
        lastRead: 22
      },
      "toastmaster9804@gmail.com": {
        messages: [
          {message: "sup", from: "them", id: 110},
          {message: "go workout", from: "me", id: 111},
          {message: "fine", from: "them", id: 112}
        ],
        tempMessageInput: "",
        lastRead: 111
      },
      "katrinaflynn79@gmail.com": {
        messages: [
          {message: "test", from: "them", id: 0},
          {message: "more test", from: "them", id: 1},
          {message: "super test", from: "them", id: 2},
          {message: "ultra test", from: "them", id: 3}
        ]
      }*/
    },

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
      state.chats[action.payload] = {messages: null, lastRead: {me: 0, them: 1}};
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
      // if (myMessages.length > 0) {
      //   myId = myMessages[myMessages.length - 1]["id"] + 1;
      // }
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
      // let myId = 0;
      // if (myMessages.length > 0) {
      //   myId = myMessages[myMessages.length - 1]["id"] + 1;
      // }
      // let myFrom = "me";
      // if ("from" in action.payload) {
      //   myFrom = action.payload["from"];
      // }
      // const newMessage = {message: action.payload["message"], from: myFrom, id: myId};
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
  setTempMessageInput, setLastRead, setInChat,
  addRequest, removeRequest
 } = dmsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.user.name)`
export const getopenedChat = state => state.dms.openedChat;
export const getChats = state => state.dms.chats;
export const getRequested = state => state.dms.requested;
export const getRequestedMe = state => state.dms.requestedMe;

export default dmsSlice.reducer;
