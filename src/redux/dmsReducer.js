import { createSlice, current } from '@reduxjs/toolkit';

export const dmsSlice = createSlice({
  name: 'dms',
  initialState: {
    openedDM: "",


    chats: {},

    requesting: [],
    requested: [],
    requested_me: [],
    already_requested: [],
    chat_exists: []
  },
  reducers: {
    setOpenedDM: (state, action) => {
      state.openedDM = action.payload;
    },
    addChat: (state, action) => {
      state.chats[action.payload] = {messages: null, lastRead: {me: null, them: null}};
    },
    addMessage: (state, action) => {
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



        // console.log(current(state).chats[myChatEmail]);

        if (myMessages == null || myMessages.length == 0 || myMessages[myMessages.length - 1].id < myID) {
          myMessages.push(newMessage);
        } else if (myMessages[0].id > myID) {
          myMessages.unshift(newMessage);
        } else {
          let findIDBefore;
          let currentSubtractCheck = 1;
          while (findIDBefore == null) {
            const tempfidb = myMessages.find( ({ id }) => id === myID - currentSubtractCheck );
            // console.log(myID - currentSubtractCheck);
            // console.log(tempfidb);
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
          if (findIDBefore != false) {
            // console.log(findIDBefore);
            // console.log(theIndex);
          }

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

        // console.log(current(state).chats[myChatEmail]);



      }


    },
    addLoadedMessages: (state, action) => {
      console.log("payload... ", action.payload);

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
    addSendingMessage: (state, action) => {
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
    removeSendingMessage: (state, action) => {
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

    setCreated: (state, action) => {
      let myChatEmail = state.openedDM;
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
    setLoadingMessages: (state, action) => {
      state.chats[action.payload["chat"]].loadingMessages = action.payload["data"];
    },

    addRequest: (state, action) => {
      if (!state[action.payload["type"]].includes(action.payload)) {
        state[action.payload["type"]].push(action.payload["email"]);
      }
    },
    removeRequest: (state, action) => {
      let index = state[action.payload["type"]].indexOf(action.payload["email"]);
      if (index > -1) {
        state[action.payload["type"]].splice(index, 1);
      }
    },
  },
});

export const { setOpenedDM, addChat, addMessage, addLoadedMessages, addSendingMessage, removeSendingMessage,
  setCreated, setTempMessageInput, setLastRead, setTyping, setInChat, setLoadingMessages,
  addRequest, removeRequest
 } = dmsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.app.name)`
export const getopenedDM = state => state.dms.openedDM;
export const getChats = state => state.dms.chats;
export const getRequested = state => state.dms.requested;
export const getRequestedMe = state => state.dms.requestedMe;

export default dmsSlice.reducer;
