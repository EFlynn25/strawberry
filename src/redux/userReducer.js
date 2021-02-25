import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: "",
    email: "",
    picture: ""
  },
  reducers: {
    setUserName: (state, action) => {
      state.name = action.payload;
    },
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    setUserPicture: (state, action) => {
      state.picture = action.payload;
    },
  },
});

export const { setUserName, setUserEmail, setUserPicture } = userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.user.name)`
export const getUserName = state => state.user.name;
export const getUserEmail = state => state.user.email;
export const getUserPicture = state => state.user.picture;

export default userSlice.reducer;
