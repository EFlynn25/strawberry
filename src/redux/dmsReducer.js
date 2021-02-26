import { createSlice } from '@reduxjs/toolkit';

export const dmsSlice = createSlice({
  name: 'dms',
  initialState: {
    dmsOpenedChat: "",


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
        ]
      },
      "toastmaster9804@gmail.com": {
        messages: [
          {message: "sup", from: "them", id: 110},
          {message: "go workout", from: "me", id: 111},
          {message: "fine", from: "them", id: 112}
        ]
      }
    },


  },
  reducers: {
    setdmsOpenedChat: (state, action) => {
      state.dmsOpenedChat = action.payload;
    },
    addMessage: (state, action) => {
      let myChatEmail = state.dmsOpenedChat;
      if ("chat" in action.payload) {
        myChatEmail = action.payload["chat"];
      }

      let myMessages = state.chats[myChatEmail]["messages"];
      let myId = myMessages[myMessages.length - 1]["id"] + 1;
      let myFrom = "me";
      if ("from" in action.payload) {
        myFrom = action.payload["from"];
      }
      const newMessage = {message: action.payload["message"], from: myFrom, id: myId};
      myMessages.push(newMessage);
      state.chats[myChatEmail]["messages"] = myMessages;
    }
  },
});

export const { setdmsOpenedChat, addMessage } = dmsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.user.name)`
export const getdmsOpenedChat = state => state.dms.dmsOpenedChat;
export const getChats = state => state.dms.chats;

export default dmsSlice.reducer;
