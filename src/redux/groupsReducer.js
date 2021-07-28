import { createSlice } from '@reduxjs/toolkit';

export const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    openedThread: null,


    threads: {
      5419739124: {
        name: "Me.",
        messages: [
          {id: 0, from: "cherryman656@gmail.com", message: "hey there", timestamp: 1200}
        ],
        people: [
          "cherryman656@gmail.com"
        ],
        lastRead: {
          "everettflynn25@gmail.com": -1
        }
      },
      5412382063: {
        name: "The Weirdo Nerds",
        messages: [
          {id: 0, from: "isaiahroman25@gmail.com", message: "wow chat", timestamp: 60}
        ],
        people: [
          "asher.molzer@gmail.com",
          "isaiahroman25@gmail.com"
        ],
        lastRead: {
          "everettflynn25@gmail.com": -1
        }
      },
      5410000000: {
        name: "unknown",
        messages: [
          {id: 0, from: "appleandroidtechmaker@gmail.com", message: "heh... heh... heh...", timestamp: 2}
        ],
        people: [
          "cherryman656@gmail.com",
          "appleandroidtechmaker@gmail.com",
          "flynneverett@logoscharter.com"
        ],
        lastRead: {
          "everettflynn25@gmail.com": -1
        }
      },
      1800555555: {
        name: "ashers doom",
        messages: [
          {id: 0, from: "flynneverett@logoscharter.com", message: "he is stuck with us. all of us.", timestamp: 1}
        ],
        people: [
          "cherryman656@gmail.com",
          "appleandroidtechmaker@gmail.com",
          "flynneverett@logoscharter.com",
          "asher.molzer@gmail.com"
        ],
        lastRead: {
          "everettflynn25@gmail.com": 0
        }
      },
      1234567890: {
        name: "everybody!",
        messages: [
          {id: 0, from: "asher.molzer@gmail.com", message: "PARTAYYY", timestamp: 0}
        ],
        people: [
          "cherryman656@gmail.com",
          "appleandroidtechmaker@gmail.com",
          "flynneverett@logoscharter.com",
          "asher.molzer@gmail.com",
          "isaiahroman25@gmail.com"
        ],
        lastRead: {
          "everettflynn25@gmail.com": -1
        }
      }
    },

    threadsCreating: [],
    threadsCreated: [],
  },
  reducers: {
    setOpenedThread: (state, action) => {
      state.openedThread = action.payload;
    },
    addThread: (state, action) => {
      state.threads[action.payload] = {messages: null, message: [], people: [], lastRead: {}};
    },
    addSendingMessage: (state, action) => {
      let myThreadID = state.openedThread;
      if ("thread" in action.payload) {
        myThreadID = action.payload["thread"];
      }

      let mySendingMessages = state.threads[myThreadID]["sendingMessages"];
      if (mySendingMessages != null) {
        mySendingMessages.push(action.payload["message"]);
        state.threads[myThreadID]["sendingMessages"] = mySendingMessages;
      } else {
        state.threads[myThreadID]["sendingMessages"] = [action.payload["message"]];
      }
    },

    setTempMessageInput: (state, action) => {
      state.threads[action.payload["thread"]].tempMessageInput = action.payload["input"];
    },
    setLastRead: (state, action) => {
      state.threads[action.payload["thread"]].lastRead[action.payload["who"]] = action.payload["lastRead"];
    },
    setTyping: (state, action) => {
      state.threads[action.payload["thread"]].typing[action.payload["who"]] = action.payload["data"];
    },
    setInThread: (state, action) => {
      state.threads[action.payload["thread"]].inThread[action.payload["who"]] = action.payload["data"];
    },
    setLoadingMessages: (state, action) => {
      state.threads[action.payload["thread"]].loadingMessages = action.payload["data"];
    },

    addThreadCreating: (state, action) => {
      state.threadsCreating.push(action.payload);
    },
    removeThreadCreating: (state, action) => {
      let index = state.threadsCreating.indexOf(action.payload);
      if (index > -1) {
        state.threadsCreating.splice(index, 1);
      }
    },
    addThreadCreated: (state, action) => {
      state.threadsCreated.push(action.payload);
    },
    removeThreadCreated: (state, action) => {
      let index = state.threadsCreated.indexOf(action.payload);
      if (index > -1) {
        state.threadsCreated.splice(index, 1);
      }
    },
  },
});

export const { setOpenedThread, addThread, addSendingMessage,
  setTempMessageInput, setLastRead, setTyping, setInThread, setLoadingMessages,
  addThreadCreating, removeThreadCreating, addThreadCreated, removeThreadCreated
} = groupsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.app.name)`
export const getOpenedThread = state => state.groups.openedThread;

export default groupsSlice.reducer;
