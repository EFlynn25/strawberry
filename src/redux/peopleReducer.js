import { createSlice } from '@reduxjs/toolkit';

export const peopleSlice = createSlice({
  name: 'people',
  initialState: {
    knownPeople: {
      // "cherryman656@gmail.com": {
      //   name: "Ethan Flynn",
      //   picture: "https://lh3.googleusercontent.com/a-/AOh14Gj-rEO3nti6bJpDqs3DgH6yEYxfgMAmhKjcAQFCAA=s70-p-k-rw-no"
      // },
      // "appleandroidtechmaker@gmail.com": {
      //   name: "Ethan Flynn",
      //   picture: "https://lh3.googleusercontent.com/a-/AOh14Gj-rEO3nti6bJpDqs3DgH6yEYxfgMAmhKjcAQFCAA=s70-p-k-rw-no"
      // },
      // "flynneverett@logoscharter.com": {
      //   name: "Charles",
      //   picture: "https://lh6.googleusercontent.com/-q2l4F6quECI/AAAAAAAAAAI/AAAAAAAAJ_k/L_v4YEhwc38KCy9bVEO6X8fydgyoUGHSACLcDEAE/s70-c-k-no-mo/photo.jpg"
      // },
      // "asher.molzer@gmail.com": {
      //   name: "Katrina Flynn",
      //   picture: "https://lh3.googleusercontent.com/a-/AOh14GilXiTyQnMeMPB83WVuLR6568QYDX2qwkOzUKKS=s70-p-k-rw-no"
      // },
      // "isaiahroman25@gmail.com": {
      //   name: "Everett Flynn",
      //   picture: "https://lh3.googleusercontent.com/a-/AOh14GiunFHTaV5EdC9DKpm1utK0Y7K-cP1lD-nh9vISog=s96-c"
      // }
    }
  },
  reducers: {
    addPerson: (state, action) => {
      state.knownPeople[action.payload["email"]] = {name: action.payload["name"], picture: action.payload["picture"]}
    },
    setpersonName: (state, action) => {
      state.knownPeople[action.payload["email"]].name = action.payload["name"];
    },
    setpersonPicture: (state, action) => {
      state.knownPeople[action.payload["email"]].picture = action.payload["picture"];
    },
  },
});

export const { addPerson, setpersonName, setpersonPicture } = peopleSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.people.name)`
export const getknownPeople = state => state.people.knownPeople;

export default peopleSlice.reducer;
