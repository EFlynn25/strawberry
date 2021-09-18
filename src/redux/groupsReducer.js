import { createSlice } from '@reduxjs/toolkit';

export const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    openedThread: null,


    threads: {
      // 5419739124: {
      //   name: "Me.",
      //   messages: [
      //     {id: 0, from: "cherryman656@gmail.com", message: "hey there", timestamp: 1200}
      //   ],
      //   people: [
      //     "cherryman656@gmail.com"
      //   ],
      //   lastRead: {
      //     "everettflynn25@gmail.com": -1
      //   }
      // },
      // 5412382063: {
      //   name: "The Weirdo Nerds",
      //   messages: [
      //     {id: 0, from: "isaiahroman25@gmail.com", message: "wow chat", timestamp: 60}
      //   ],
      //   people: [
      //     "asher.molzer@gmail.com",
      //     "isaiahroman25@gmail.com"
      //   ],
      //   lastRead: {
      //     "everettflynn25@gmail.com": -1
      //   }
      // },
      // 5410000000: {
      //   name: "unknown",
      //   messages: [
      //     {id: 0, from: "appleandroidtechmaker@gmail.com", message: "heh... heh... heh...", timestamp: 2}
      //   ],
      //   people: [
      //     "cherryman656@gmail.com",
      //     "appleandroidtechmaker@gmail.com",
      //     "flynneverett@logoscharter.com"
      //   ],
      //   lastRead: {
      //     "everettflynn25@gmail.com": -1
      //   }
      // },
      // 1800555555: {
      //   name: "ashers doom",
      //   messages: [
      //     {id: 0, from: "flynneverett@logoscharter.com", message: "he is stuck with us. all of us.", timestamp: 1}
      //   ],
      //   people: [
      //     "cherryman656@gmail.com",
      //     "appleandroidtechmaker@gmail.com",
      //     "flynneverett@logoscharter.com",
      //     "asher.molzer@gmail.com"
      //   ],
      //   lastRead: {
      //     "everettflynn25@gmail.com": 0
      //   }
      // },
      // 1234567890: {
      //   name: "everybody!",
      //   messages: [
      //     {id: 0, from: "asher.molzer@gmail.com", message: "PARTAYYY", timestamp: 0}
      //   ],
      //   people: [
      //     "cherryman656@gmail.com",
      //     "appleandroidtechmaker@gmail.com",
      //     "flynneverett@logoscharter.com",
      //     "asher.molzer@gmail.com",
      //     "isaiahroman25@gmail.com"
      //   ],
      //   lastRead: {
      //     "everettflynn25@gmail.com": -1
      //   }
      // }
    },

    threadsCreating: [],
    threadsCreated: [],
  },
  reducers: {
    setOpenedThread: (state, action) => {
      state.openedThread = action.payload;
    },
    addThread: (state, action) => {
      state.threads[action.payload] = {name: "", messages: null, people: null, lastRead: {}, inThread: [], typing: []};
    },
    removeThread: (state, action) => {
      if (Object.keys(state.threads).includes(action.payload.toString())) {
        delete state.threads[action.payload]
      }
      // state.threads[action.payload]
    },
    setThreadName: (state, action) => {
      state.threads[action.payload.thread_id].name = action.payload.name;
    },
    addThreadPeople: (state, action) => {
      const threadPeople = state.threads[action.payload.thread_id].people;
      if (threadPeople) {
        action.payload.people.forEach(item => {
          if (!threadPeople.includes(item)) {
            // state.threads[action.payload.thread_id].people.push(item);
            threadPeople.push(item);
          }
        });
      } else {
        state.threads[action.payload.thread_id].people = action.payload.people;
      }
    },
    removeThreadPerson: (state, action) => {
      const threadPeople = state.threads[action.payload.thread_id].people;
      if (threadPeople.includes(action.payload.person)) {
        // threadPeople.remove(action.payload.person);
        threadPeople.splice(threadPeople.indexOf(action.payload.person), 1);
      }
    },
    addThreadMessage: (state, action) => {
      let myThreadID = state.openedThread;
      if ("thread_id" in action.payload) {
        myThreadID = action.payload["thread_id"];
      }

      let myMessages = state.threads[myThreadID].messages;
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
      let myFrom = action.payload.from;
      // if ("from" in action.payload) {
      //   myFrom = action.payload["from"];
      // }
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

        state.threads[myThreadID].messages = myMessages;



        const lm = state.threads[myThreadID].loadingMessages;
        if (lm != null) {
          const index = lm.indexOf(myID);
          if (index > -1) {
            state.threads[myThreadID].loadingMessages.splice(index, 1);
          }
        }

        // console.log(current(state).chats[myChatEmail]);



      }


    },
    addLoadedThreadMessages: (state, action) => {
      let myThreadID = action.payload.thread_id;
      if (state.threads[myThreadID].messages == null) {
        state.threads[myThreadID].messages = action.payload.messages;
      } else {
        const newArray = action.payload.messages.concat(state.threads[myThreadID].messages);
        state.threads[myThreadID].messages = newArray;
      }

      const lm = state.threads[myThreadID].loadingMessages;
      if (lm != null) {
        action.payload.messages.forEach((item, i) => {
          const myID = item.id;
          const index = lm.indexOf(myID);
          if (index > -1) {
            state.threads[myThreadID].loadingMessages.splice(index, 1);
          }
        });
      }
    },
    addSendingThreadMessage: (state, action) => {
      let myThreadID = state.openedThread;
      if ("thread_id" in action.payload) {
        myThreadID = action.payload["thread_id"];
      }

      let mySendingMessages = state.threads[myThreadID]["sendingMessages"];
      if (mySendingMessages != null) {
        mySendingMessages.push(action.payload["message"]);
        state.threads[myThreadID]["sendingMessages"] = mySendingMessages;
      } else {
        state.threads[myThreadID]["sendingMessages"] = [action.payload["message"]];
      }
    },
    removeSendingThreadMessage: (state, action) => {
      let myThreadID = state.openedThread;
      if ("thread_id" in action.payload) {
        myThreadID = action.payload["thread_id"];
      }

      let mySendingMessages = state.threads[myThreadID]["sendingMessages"];
      var index = mySendingMessages.indexOf(action.payload["message"]);
      if (index > -1) {
        mySendingMessages.splice(index, 1);
      }
      state.threads[myThreadID]["sendingMessages"] = mySendingMessages;
    },
    setTempMessageInput: (state, action) => {
      console.log("state: ", JSON.stringify(state));
      console.log("payload: ", action.payload);
      state.threads[action.payload["thread_id"]].tempMessageInput = action.payload["input"];
    },
    setThreadLastRead: (state, action) => {
      console.log("payload: ", action.payload);
      if (action.payload["last_read"] != null) {
        Object.keys(action.payload["last_read"]).forEach(item => {
          console.log(item);
          state.threads[action.payload["thread_id"]].lastRead[item] = action.payload["last_read"][item];
          // state.threads[action.payload["thread_id"]].lastRead[item] = null;
        });
      }
      // state.threads[action.payload["thread_id"]].lastRead[action.payload["who"]] = action.payload["lastRead"];
    },
    setTyping: (state, action) => {
      state.threads[action.payload["thread_id"]].typing[action.payload["who"]] = action.payload["data"];
    },
    setInThread: (state, action) => {
      let myInThread = state.threads[action.payload["thread_id"]].inThread;
      if (Array.isArray(action.payload["people"])) {
        action.payload["people"].forEach(item => {
          if (!myInThread.includes(item)) {
            myInThread.push(item);
          }
        });
        myInThread.forEach(item => {
          if (!action.payload["people"].includes(item)) {
            const index = myInThread.indexOf(item);
            if (index > -1) {
              myInThread.splice(index, 1);
            }
          }
        });
      } else {
        if (action.payload["data"]) {
          if (!myInThread.includes(action.payload["people"])) {
            myInThread.push(action.payload["people"]);
          }
        } else {
          if (myInThread.includes(action.payload["people"])) {
            const index = myInThread.indexOf(action.payload["people"]);
            if (index > -1) {
              myInThread.splice(index, 1);
            }
          }
        }
      }
    },
    setLoadingMessages: (state, action) => {
      state.threads[action.payload["thread_id"]].loadingMessages = action.payload["data"];
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

export const { setOpenedThread, addThread, removeThread, setThreadName, addThreadPeople, removeThreadPerson, addThreadMessage, addLoadedThreadMessages, addSendingThreadMessage, removeSendingThreadMessage,
  setTempMessageInput, setThreadLastRead, setTyping, setInThread, setLoadingMessages,
  addThreadCreating, removeThreadCreating, addThreadCreated, removeThreadCreated
} = groupsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.app.name)`
export const getOpenedThread = state => state.groups.openedThread;

export default groupsSlice.reducer;
