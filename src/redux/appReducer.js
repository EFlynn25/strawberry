import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    email: "",
    name: "",
    picture: "",
    status: null,
    posts: null,
    firstPost: null,
    likedPosts: [],
    loadingPosts: false,

    dmsOrGroups: "",
    hideRightPanel: true,

    dmsLoaded: false,
    groupsLoaded: false,
    peopleLoaded: true,

    socket: null,
    multipleTabs: false,

    currentPage: "",
    notificationCount: {},
    mobile: false,

    messageStyle: "default",

    announcements: {},
    announcementsRead: []
  },
  reducers: {
    setAppState: (state, action) => {
      Object.keys(action.payload).forEach((item) => {
        if (item.includes(".")) {
          let currentReference = state;
          const dotSplit = item.split(".");
          const dsLastIndex = dotSplit.length - 1;
          dotSplit.forEach((item, i) => {
            if (i < dsLastIndex) {
              currentReference = currentReference[item];
            }
          });
          currentReference[dotSplit[dsLastIndex]] = action.payload[item];
        } else {
          state[item] = action.payload[item];
        }
      });
    },
    pushAppArrayValue: (state, action) => {
      Object.keys(action.payload).forEach((item) => {
        state[item].push(action.payload[item]);
      });
    },

    addUserPost: (state, action) => {
      if (state.posts == null) {
        state.posts = []
      }
      if (Array.isArray(action.payload)) {
        action.payload.forEach((item, i) => {
          delete item.email
          state.posts.push(item);
        });
      } else {
        delete action.payload.email
        state.posts.push(action.payload);
      }
    },
    setUserLikedPost: (state, action) => {
      if (Array.isArray(action.payload["post_id"])) {
        action.payload["post_id"].forEach((item, i) => {
          if (action.payload["data"]) {
            state.likedPosts.push(item);
          } else {
            let index = state.likedPosts.indexOf(item);
            if (index > -1) {
              state.likedPosts.splice(index, 1);
            }
          }
        });
      } else {
        if (action.payload["data"]) {
          state.likedPosts.push(action.payload["post_id"]);
        } else {
          let index = state.likedPosts.indexOf(action.payload["post_id"]);
          if (index > -1) {
            state.likedPosts.splice(index, 1);
          }
        }
      }
    },
    setLikedPost: (state, action) => {
      let postIndex;
      state.posts.some((post_item, i) => {
        if (post_item.post_id == action.payload["post_id"]) {
          postIndex = i;
          return true;
        }
      });

      if (action.payload["data"]) {
        state.posts[postIndex].likes++;
      } else {
        state.posts[postIndex].likes--;
      }
    },
    editUserPost: (state, action) => {
      state.posts.some((item, i) => {
        if (item.post_id == action.payload["post_id"]) {
          state.posts[i].message = action.payload["message"];
          state.posts[i].edited = action.payload["edited"];
          return true;
        }
        return false;
      });
    },
    deleteUserPost: (state, action) => {
      state.posts.some((item, i) => {
        if (item.post_id == action.payload["post_id"]) {
          state.posts.splice(i, 1);
          return true;
        }
        return false;
      });
    },
  },
});

export const {
  setAppState, pushAppArrayValue,
  addUserPost, setUserLikedPost, setLikedPost, setUserLoadingPosts, editUserPost, deleteUserPost,
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
