import { createSlice } from '@reduxjs/toolkit';

export const peopleSlice = createSlice({
  name: 'people',
  initialState: {
    knownPeople: {},
    loadingPosts: [],
    notUsers: [],
  },
  reducers: {
    pushPeopleArrayValue: (state, action) => {
      Object.keys(action.payload).forEach((item) => {
        state[item].push(action.payload[item]);
      });
    },

    addPerson: (state, action) => {
      if (Object.keys(state.knownPeople).includes(action.payload["email"])) {
        state.knownPeople[action.payload["email"]].name = action.payload.name;
        state.knownPeople[action.payload["email"]].picture = action.payload.picture;
        state.knownPeople[action.payload["email"]].status = action.payload.status;
      } else {
        state.knownPeople[action.payload["email"]] = {name: action.payload["name"], picture: action.payload["picture"], status: action.payload["status"], firstPost: action.payload["first_post"], posts: null}
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
      let myRef = state.knownPeople[action.payload["email"]];
      if (myRef != null) {
        myRef.online = action.payload["online"];
      }
    },
    addpersonPost: (state, action) => {
      const myPerson = state.knownPeople[action.payload["email"]];
      if (myPerson.posts == null) {
        state.knownPeople[action.payload["email"]].posts = []
      }

      if (Array.isArray(action.payload["post"])) {
        action.payload["post"].forEach((item, i) => {
          delete item.email
          state.knownPeople[action.payload["email"]].posts.push(item);
        });
      } else {
        delete action.payload["post"].email
        state.knownPeople[action.payload["email"]].posts.push(action.payload["post"]);
        if (myPerson.firstPost == null) {
          state.knownPeople[action.payload["email"]].firstPost = action.payload["post"].post_id;
        }
      }
    },
    setpersonLikedPost: (state, action) => {
      let postEmail;
      let postIndex;
      Object.keys(state.knownPeople).some((item) => {
        const myPerson = state.knownPeople[item];
        if (myPerson.posts == null){
          return false
        }
        return state.knownPeople[item].posts.some((post_item, i) => {
          if (post_item.post_id == action.payload["post_id"]) {
            postEmail = item;
            postIndex = i;
            return true;
          }
        });
      });

      if (postEmail != null) {
        if (action.payload["data"]) {
          state.knownPeople[postEmail].posts[postIndex].likes++;
        } else {
          state.knownPeople[postEmail].posts[postIndex].likes--;
        }
      }
    },
    addLoadingPosts: (state, action) => {
      if (action.payload["data"]) {
        if (!state.loadingPosts.includes(action.payload["email"])) {
          state.loadingPosts.push(action.payload["email"]);
        }
      } else {
        let index = state.loadingPosts.indexOf(action.payload["email"]);
        if (index > -1) {
          state.loadingPosts.splice(index, 1);
        }
      }
    },
    editpersonPost: (state, action) => {
      const myPerson = state.knownPeople[action.payload["email"]];
      myPerson.posts.some((item, i) => {
        if (item.post_id == action.payload["post_id"]) {
          state.knownPeople[action.payload["email"]].posts[i].message = action.payload["message"];
          state.knownPeople[action.payload["email"]].posts[i].edited = action.payload["edited"];
          return true;
        }
        return false;
      });
    },
    deletepersonPost: (state, action) => {
      const myPerson = state.knownPeople[action.payload["email"]];
      myPerson.posts.some((item, i) => {
        if (item.post_id == action.payload["post_id"]) {
          state.knownPeople[action.payload["email"]].posts.splice(i, 1);
          return true;
        }
        return false;
      });
    },
  },
});

export const {
  pushPeopleArrayValue,
  addPerson, setpersonName, setpersonPicture, setpersonStatus, setpersonOnline,
  addpersonPost, setpersonLikedPost, addLoadingPosts, editpersonPost, deletepersonPost
} = peopleSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.people.name)`
export const getknownPeople = state => state.people.knownPeople;

export default peopleSlice.reducer;
