import { createSlice } from '@reduxjs/toolkit';

export const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    openedThread: null,


    threads: {},

    threadsCreating: [],
    threadsCreated: [],

    requests: {}
  },
  reducers: {
    setOpenedThread: (state, action) => {
      state.openedThread = action.payload;
    },
    addThread: (state, action) => {
      state.threads[action.payload] = {name: "", messages: null, people: null, lastRead: {}, inThread: [], typing: [], requested: []};
    },
    removeThread: (state, action) => {
      if (Object.keys(state.threads).includes(action.payload.toString())) {
        delete state.threads[action.payload]
      }
      // state.threads[action.payload]
    },
    setThreadName: (state, action) => {
      state.threads[action.payload.thread_id].name = action.payload.new_name;
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
      console.log("atm payload... ", action.payload)
      let myThreadID = state.openedThread;
      if ("thread_id" in action.payload) {
        myThreadID = action.payload["thread_id"];
      }

      console.log(myThreadID);
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
    editThreadMessage: (state, action) => {
      let myMessages = state.threads[action.payload["thread_id"]].messages;
      myMessages.some((item, i) => {
        if (item.id == action.payload["id"]) {
          state.threads[action.payload["thread_id"]].messages[i].message = action.payload["message"];
          state.threads[action.payload["thread_id"]].messages[i].edited = action.payload["edited"];
        }
      })
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

    setThreadCreated: (state, action) => {
      state.threads[action.payload.thread].created = action.payload.created;
    },
    setTempMessageInput: (state, action) => {
      state.threads[action.payload["thread_id"]].tempMessageInput = action.payload["input"];
    },
    setThreadLastRead: (state, action) => {
      if (action.payload["last_read"] != null) {
        Object.keys(action.payload["last_read"]).forEach(item => {
          state.threads[action.payload["thread_id"]].lastRead[item] = action.payload["last_read"][item];
        });
      }
    },
    setThreadTyping: (state, action) => {
      let myTyping = state.threads[action.payload["thread_id"]].typing;
      if (Array.isArray(action.payload["people"])) {
        action.payload["people"].forEach(item => {
          if (!myTyping.includes(item)) {
            myTyping.push(item);
          }
        });
        myTyping.forEach(item => {
          if (!action.payload["people"].includes(item)) {
            const index = myTyping.indexOf(item);
            if (index > -1) {
              myTyping.splice(index, 1);
            }
          }
        });
      } else {
        if (action.payload["data"]) {
          if (!myTyping.includes(action.payload["people"])) {
            myTyping.push(action.payload["people"]);
          }
        } else {
          if (myTyping.includes(action.payload["people"])) {
            const index = myTyping.indexOf(action.payload["people"]);
            if (index > -1) {
              myTyping.splice(index, 1);
            }
          }
        }
      }
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
    addRequested: (state, action) => {
      let myThread = state.threads[action.payload.thread_id];
      if (myThread.requested == null) {
        myThread.requested = [];
      }

      action.payload.people.forEach(item => {
        if (!myThread.requested.includes(item)) {
          myThread.requested.push(item)
        }
      });
    },
    removeRequested: (state, action) => {
      let myThread = state.threads[action.payload.thread_id];
      if (myThread.requested != null) {
        action.payload.people.forEach(item => {
          if (myThread.requested.includes(item)) {
            const index = myThread.requested.indexOf(item);
            if (index > -1) {
              myThread.requested.splice(index, 1);
            }
          }
        });
      }
    },
    addThreadRequest: (state, action) => {
      Object.assign(state.requests, action.payload)
    },
    removeThreadRequest: (state, action) => {
      delete state.requests[action.payload]
    },
  },
});

export const { setOpenedThread, addThread, removeThread, setThreadName, addThreadPeople, removeThreadPerson, addThreadMessage, editThreadMessage, addLoadedThreadMessages, addSendingThreadMessage, removeSendingThreadMessage,
  setThreadCreated, setTempMessageInput, setThreadLastRead, setThreadTyping, setInThread, setLoadingMessages,
  addThreadCreating, removeThreadCreating, addThreadCreated, removeThreadCreated,
  addRequested, removeRequested,
  addThreadRequest, removeThreadRequest
} = groupsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.app.name)`
export const getOpenedThread = state => state.groups.openedThread;

export default groupsSlice.reducer;
