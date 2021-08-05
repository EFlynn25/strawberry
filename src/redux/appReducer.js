import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    name: "",
    email: "",
    picture: "",

    dmsOrGroups: "",
    hideRightPanel: true,

    dmsLoaded: false,
    groupsLoaded: false,
    peopleLoaded: false,

    socket: null,

    currentPage: "",
    notificationCount: {},

    messageStyle: "default",

    announcements: {},
    announcementsRead: []
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
    setgroupsLoaded: (state, action) => {
      state.groupsLoaded = action.payload;
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
    },
    setMessageStyle: (state, action) => {
      state.messageStyle = action.payload;
    },
    setAnnouncement: (state, action) => {
      state.announcements[action.payload.id] = {title: action.payload.title, content: action.payload.content, timestamp: action.payload.timestamp};
    },
    setAnnouncementRead: (state, action) => {
      state.announcementsRead.push(action.payload);
    }
  },
});

export const { setUserName, setUserEmail, setUserPicture,
  setdmsOrGroups, sethideRightPanel,
  setdmsLoaded, setgroupsLoaded, setpeopleLoaded,
  setSocket,
  setCurrentPage, setNotificationCount,
  setMessageStyle,
  setAnnouncement, setAnnouncementRead
} = appSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.app.name)`
export const getUserName = state => state.app.name;
export const getUserEmail = state => state.app.email;
export const getUserPicture = state => state.app.picture;
export const getdmsOrGroups = state => state.app.dmsOrGroups;
export const gethideRightPanel = state => state.app.hideRightPanel;
export const getdmsLoaded = state => state.app.dmsLoaded;
export const getpeopleLoaded = state => state.app.peopleLoaded;
export const getSocket = state => state.app.socket;
export const getCurrentPage = state => state.app.currentPage;
export const getNotificationCount = state => state.app.notificationCount;
export const getMessageStyle = state => state.app.messageStyle;

export default appSlice.reducer;
