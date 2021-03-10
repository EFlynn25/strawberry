import { createSlice } from '@reduxjs/toolkit';

export const dmsSlice = createSlice({
  name: 'dms',
  initialState: {
    openedChat: "",


    chats: {
      "ethanflynn2007@gmail.com": {
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
      }
    },

    requested: [],
    alreadyRequested: []
  },
  reducers: {
    setopenedChat: (state, action) => {
      state.openedChat = action.payload;
    },
    addChat: (state, action) => {
      state.chats[action.payload] = {messages: []};
    },
    addMessage: (state, action) => {
      let myChatEmail = state.openedChat;
      if ("chat" in action.payload) {
        myChatEmail = action.payload["chat"];
      }

      let myMessages = state.chats[myChatEmail]["messages"];
      let myId = 0;
      if (myMessages.length > 0) {
        myId = myMessages[myMessages.length - 1]["id"] + 1;
      }
      let myFrom = "me";
      if ("from" in action.payload) {
        myFrom = action.payload["from"];
      }
      const newMessage = {message: action.payload["message"], from: myFrom, id: myId};
      myMessages.push(newMessage);
      state.chats[myChatEmail]["messages"] = myMessages;
    },
    setTempMessageInput: (state, action) => {
      state.chats[action.payload["chat"]].tempMessageInput = action.payload["input"];
    },
    setLastRead: (state, action) => {
      state.chats[action.payload["chat"]].lastRead = action.payload["lastRead"];
    },
    addRequested: (state, action) => {
      if (!state.requested.includes(action.payload)) {
        state.requested.push(action.payload);
      }
    },
    removeRequested: (state, action) => {
      var index = state.requested.indexOf(action.payload);
      if (index > -1) {
        state.requested.splice(index, 1);
      }
    },
    addAlreadyRequested: (state, action) => {
      if (!state.alreadyRequested.includes(action.payload)) {
        state.alreadyRequested.push(action.payload);
      }
    },
    removeAlreadyRequested: (state, action) => {
      var index = state.alreadyRequested.indexOf(action.payload);
      if (index > -1) {
        state.alreadyRequested.splice(index, 1);
      }
    }
  },
});

export const { setopenedChat, addChat, addMessage, setTempMessageInput, setLastRead, addRequested, removeRequested, addAlreadyRequested, removeAlreadyRequested } = dmsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.user.name)`
export const getopenedChat = state => state.dms.openedChat;
export const getChats = state => state.dms.chats;
export const getRequested = state => state.dms.requested;
export const getAlreadyRequested = state => state.dms.alreadyRequested;

export default dmsSlice.reducer;
