import { createSlice } from '@reduxjs/toolkit';

export const peopleSlice = createSlice({
  name: 'people',
  initialState: {
    knownPeople: {}
  },
  reducers: {
    addPerson: (state, action) => {
      if (Object.keys(state.knownPeople).includes(action.payload["email"])) {
        state.knownPeople[action.payload["email"]].name = action.payload.name;
        state.knownPeople[action.payload["email"]].picture = action.payload.picture;
        state.knownPeople[action.payload["email"]].status = action.payload.status;
      } else {
        state.knownPeople[action.payload["email"]] = {name: action.payload["name"], picture: action.payload["picture"], status: action.payload["status"]}
      }
    },
    setpersonName: (state, action) => {
      state.knownPeople[action.payload["email"]].name = action.payload["name"];
    },
    setpersonPicture: (state, action) => {
      state.knownPeople[action.payload["email"]].picture = action.payload["picture"];
    },
    setpersonStatus: (state, action) => {
      state.knownPeople[action.payload["email"]].status = action.payload["status"];
    },
    setpersonOnline: (state, action) => {
      state.knownPeople[action.payload["email"]].online = action.payload["online"];
    },
  },
});

export const { addPerson, setpersonName, setpersonPicture, setpersonStatus, setpersonOnline } = peopleSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.people.name)`
export const getknownPeople = state => state.people.knownPeople;

export default peopleSlice.reducer;
