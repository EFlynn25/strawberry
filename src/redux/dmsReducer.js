import { createSlice } from '@reduxjs/toolkit';

export const dmsSlice = createSlice({
  name: 'dms',
  initialState: {
    openedDM: "",


    chats: {},

    requesting: [],
    requested: [],
    requested_me: [],
    already_requested: [],
    chat_exists: [],

    requests: []
  },
  reducers: {
    setOpenedDM: (state, action) => {
      state.openedDM = action.payload;
    },
    addChat: (state, action) => {
      state.chats[action.payload] = {messages: null, lastRead: {me: null, them: null}};
    },
    addChatMessage: (state, action) => {
      let myChatEmail = state.openedDM;
      if ("chat" in action.payload) {
        myChatEmail = action.payload["chat"];
      }

      let myMessages = state.chats[myChatEmail]["messages"];
      if (myMessages == null) {
        myMessages = [];
      }

      let myID = 0;
      if ("id" in action.payload) {
        myID = action.payload["id"];
      } else {
        if (myMessages.length > 0) {
          myID = myMessages[myMessages.length - 1]["id"] + 1;
        }
      }
      let myFrom = "me";
      if ("from" in action.payload) {
        myFrom = action.payload["from"];
      }
      const newMessage = {message: action.payload["message"], from: myFrom, id: myID, timestamp: action.payload["timestamp"]};


      if (myMessages.find( ({ id }) => id === myID ) == null) {



        if (myMessages == null || myMessages.length == 0 || myMessages[myMessages.length - 1].id < myID) {
          myMessages.push(newMessage);
        } else if (myMessages[0].id > myID) {
          myMessages.unshift(newMessage);
        } else {
          let findIDBefore;
          let currentSubtractCheck = 1;
          while (findIDBefore == null) {
            const tempfidb = myMessages.find( ({ id }) => id === myID - currentSubtractCheck );
            if (tempfidb != null) {
              findIDBefore = tempfidb;
            } else {
              if (myID - (currentSubtractCheck + 1) < 0) {
                findIDBefore = false;
              } else {
                currentSubtractCheck++;
              }
            }
          }

          const theIndex = myMessages.indexOf(findIDBefore);
          myMessages.splice(theIndex, 0, newMessage);
        }

        state.chats[myChatEmail]["messages"] = myMessages;



        const lm = state.chats[myChatEmail].loadingMessages;
        if (lm != null) {
          const index = lm.indexOf(myID);
          if (index > -1) {
            state.chats[myChatEmail].loadingMessages.splice(index, 1);
          }
        }



      }


    },
    editChatMessage: (state, action) => {
      let myMessages = state.chats[action.payload["chat"]].messages;
      myMessages.some((item, i) => {
        if (item.id == action.payload["id"]) {
          state.chats[action.payload["chat"]].messages[i].message = action.payload["message"];
          state.chats[action.payload["chat"]].messages[i].edited = action.payload["edited"];
        }
      })
    },
    addLoadedChatMessages: (state, action) => {
      let myChatEmail = action.payload.chat;
      if (state.chats[myChatEmail].messages == null) {
        state.chats[myChatEmail].messages = action.payload.messages;
      } else {
        const newArray = action.payload.messages.concat(state.chats[myChatEmail].messages);
        state.chats[myChatEmail].messages = newArray;
      }

      const lm = state.chats[myChatEmail].loadingMessages;
      if (lm != null) {
        action.payload.messages.forEach((item, i) => {
          const myID = item.id;
          const index = lm.indexOf(myID);
          if (index > -1) {
            state.chats[myChatEmail].loadingMessages.splice(index, 1);
          }
        });
      }
    },
    addSendingChatMessage: (state, action) => {
      let myChatEmail = state.openedDM;
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
    removeSendingChatMessage: (state, action) => {
      let myChatEmail = state.openedDM;
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

    setChatCreated: (state, action) => {
      let myChatEmail = state.openedDM;
      if ("chat" in action.payload) {
        myChatEmail = action.payload["chat"];
      }

      state.chats[myChatEmail].created = action.payload.created;
    },
    setTempMessageInput: (state, action) => {
      state.chats[action.payload["chat"]].tempMessageInput = action.payload["input"];
    },
    setChatLastRead: (state, action) => {
      if (action.payload["who"] == "me") {
        state.chats[action.payload["chat"]].lastRead.me = action.payload["lastRead"];
      } else if (action.payload["who"] == "them") {
        state.chats[action.payload["chat"]].lastRead.them = action.payload["lastRead"];
      }
    },
    setChatTyping: (state, action) => {
      state.chats[action.payload["chat"]].typing = action.payload["data"];
    },
    setInChat: (state, action) => {
      state.chats[action.payload["chat"]].inChat = action.payload["data"];
    },
    setLoadingMessages: (state, action) => {
      state.chats[action.payload["chat"]].loadingMessages = action.payload["data"];
    },

    addChatRequest: (state, action) => {
      if (!state[action.payload["type"]].includes(action.payload)) {
        if (Array.isArray(action.payload["email"])) {
          state[action.payload["type"]] = state[action.payload["type"]].concat(action.payload["email"])
        } else {
          state[action.payload["type"]].push(action.payload["email"]);
        }
      }
    },
    removeChatRequest: (state, action) => {
      let index = state[action.payload["type"]].indexOf(action.payload["email"]);
      if (index > -1) {
        state[action.payload["type"]].splice(index, 1);
      }
    },
  },
});

export const { setOpenedDM, addChat, addChatMessage, editChatMessage, addLoadedChatMessages, addSendingChatMessage, removeSendingChatMessage,
  setChatCreated, setTempMessageInput, setChatLastRead, setChatTyping, setInChat, setLoadingMessages,
  addChatRequest, removeChatRequest
 } = dmsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.app.name)`
export const getopenedDM = state => state.dms.openedDM;
export const getChats = state => state.dms.chats;
export const getRequested = state => state.dms.requested;
export const getRequestedMe = state => state.dms.requestedMe;

export default dmsSlice.reducer;
