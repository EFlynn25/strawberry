import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    name: "",
    email: "",
    picture: "",
    status: null,
    // posts: [{post_id: 0, message: "Today sucked.", likes: 10, timestamp: 0}, {post_id: 12, message: "Today was great!", likes: 0, timestamp: 700350}],
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
    setUserStatus: (state, action) => {
      state.status = action.payload;
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
    setUserFirstPost: (state, action) => {
      state.firstPost = action.payload;
    },
    setUserLikedPost: (state, action) => {
      if (Array.isArray(action.payload["post_id"])) {
        action.payload["post_id"].forEach((item, i) => {
          if (action.payload["data"]) {
            state.likedPosts.push(item);
          } else {
            // state.likedPosts.remove(item);

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
          // state.likedPosts.remove(action.payload["post_id"]);

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
    setUserLoadingPosts: (state, action) => {
      state.loadingPosts = action.payload;
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
    setMultipleTabs: (state, action) => {
      state.multipleTabs = action.payload;
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

export const { setUserName, setUserEmail, setUserPicture, setUserStatus,
  addUserPost, setUserFirstPost, setUserLikedPost, setLikedPost, setUserLoadingPosts,
  setdmsOrGroups, sethideRightPanel,
  setdmsLoaded, setgroupsLoaded, setpeopleLoaded,
  setSocket, setMultipleTabs,
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
