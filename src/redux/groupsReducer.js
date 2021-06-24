import { createSlice } from '@reduxjs/toolkit';

export const groupsSlice = createSlice({
  name: 'groups',
  initialState: {
    groupsOpenedThread: 0,


    threads: {
      5419739124: {
        messages: [
          {message: "hey there"}
        ],
        people: [
          "ethanflynn2007@gmail.com",
          "katrinaflynn79@gmail.com"
        ]
      },
      5412382063: {
        messages: [
          {message: "wow chat"}
        ],
        people: [
          "asher.molzer@gmail.com",
          "isaiahroman25@gmail.com"
        ]
      }
    }


  },
  reducers: {
    setgroupsOpenedThread: (state, action) => {
      state.groupsOpenedThread = action.payload;
    },
  },
});

export const { setgroupsOpenedThread } = groupsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.app.name)`
export const getgroupsOpenedThread = state => state.groups.groupsOpenedThread;

export default groupsSlice.reducer;
