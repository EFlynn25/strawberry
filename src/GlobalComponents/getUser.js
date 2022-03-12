import mainStore from '../redux/mainStore.js';
import { get_user_info } from '../socket.js';

let fetchingUsers = [];

export function getUser(user) {
  const localKnownPeople = mainStore.getState().people.knownPeople;
  if (Object.keys(localKnownPeople).includes(user)) {
    return localKnownPeople[user];
  } else if (user == mainStore.getState().app.email) {
    return {"name": mainStore.getState().app.name, "picture": mainStore.getState().app.picture, "status": mainStore.getState().app.status, "online": true};
  }
  if (user != null && !fetchingUsers.includes(user) && user.includes("@") && user != mainStore.getState().app.email) {
    get_user_info(user);
    fetchingUsers.push(user);
  }
  return {"name": user, "picture": "/assets/images/default_profile_pic.png", "status": "", "online": false};
}


// This is one of my favorite files. It's concise, can be used everywhere,
// and has helped me with so many null errors.
