import { createSlice } from '@reduxjs/toolkit';

export const peopleSlice = createSlice({
  name: 'people',
  initialState: {
    knownPeople: {}
  },
  reducers: {
    addPerson: (state, action) => {
      console.log("add person ", action.payload)
      if (Object.keys(state.knownPeople).includes(action.payload["email"])) {
        state.knownPeople[action.payload["email"]].name = action.payload.name;
        state.knownPeople[action.payload["email"]].picture = action.payload.picture;
        state.knownPeople[action.payload["email"]].status = action.payload.status;
      } else {
        state.knownPeople[action.payload["email"]] = {name: action.payload["name"], picture: action.payload["picture"], status: action.payload["status"], firstPost: action.payload["first_post"], posts: null}
        // , posts: [{post_id: 0, message: "Today sucked.", likes: 10, timestamp: 0}, {post_id: 12, message: "Today was great!", likes: 0, timestamp: 700350}]
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
  },
});

export const { addPerson, setpersonName, setpersonPicture, setpersonStatus, setpersonOnline, addpersonPost, setpersonLikedPost } = peopleSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.people.name)`
export const getknownPeople = state => state.people.knownPeople;

export default peopleSlice.reducer;
