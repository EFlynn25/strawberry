import { createSlice } from '@reduxjs/toolkit';

export const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    openedThread: null,


    threads: {
      5419739124: {
        name: "Me.",
        messages: [
          {id: 0, from:"cherryman656@gmail.com", message: "hey there", timestamp: 1200}
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
          {id: 0, from:"isaiahroman25@gmail.com", message: "wow chat", timestamp: 60}
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
          {id: 0, from:"appleandroidtechmaker@gmail.com", message: "heh... heh... heh...", timestamp: 2}
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
          {id: 0, from:"flynneverett@logoscharter.com", message: "he is stuck with us. all of us.", timestamp: 1}
        ],
        people: [
          "cherryman656@gmail.com",
          "appleandroidtechmaker@gmail.com",
          "flynneverett@logoscharter.com",
          "asher.molzer@gmail.com"
        ],
        lastRead: {
          "everettflynn25@gmail.com": -1
        }
      },
      1234567890: {
        name: "everybody!",
        messages: [
          {id: 0, from:"asher.molzer@gmail.com", message: "PARTAYYY", timestamp: 0}
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
    }


  },
  reducers: {
    setOpenedThread: (state, action) => {
      state.openedThread = action.payload;
    },
  },
});

export const { setOpenedThread } = groupsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.app.name)`
export const getOpenedThread = state => state.groups.openedThread;

export default groupsSlice.reducer;
