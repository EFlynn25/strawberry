import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: "",
    email: "",
    picture: "",

    dmsOrGroups: "",
    hideRightPanel: true,

    dmsLoaded: false,
    peopleLoaded: false,

    socket: null,

    currentPage: "",
    notificationCount: {}
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
    setdmsOrGroups: (state, action) => {
      state.dmsOrGroups = action.payload;
    },
    sethideRightPanel: (state, action) => {
      state.hideRightPanel = action.payload;
    },
    setdmsLoaded: (state, action) => {
      state.dmsLoaded = action.payload;
    },
    setpeopleLoaded: (state, action) => {
      state.peopleLoaded = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setNotificationCount: (state, action) => {
      state.notificationCount[action.payload.type] = action.payload.count;
    }
  },
});

export const { setUserName, setUserEmail, setUserPicture,
  setdmsOrGroups, sethideRightPanel,
  setdmsLoaded, setpeopleLoaded,
  setSocket,
  setCurrentPage, setNotificationCount
} = userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.user.name)`
export const getUserName = state => state.user.name;
export const getUserEmail = state => state.user.email;
export const getUserPicture = state => state.user.picture;
export const getdmsOrGroups = state => state.user.dmsOrGroups;
export const gethideRightPanel = state => state.user.hideRightPanel;
export const getdmsLoaded = state => state.user.dmsLoaded;
export const getpeopleLoaded = state => state.user.peopleLoaded;
export const getSocket = state => state.user.socket;
export const getCurrentPage = state => state.user.currentPage;
export const getNotificationCount = state => state.user.notificationCount;

export default userSlice.reducer;
