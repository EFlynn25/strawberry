import mainStore from '../redux/mainStore.js';
import { get_user_info } from '../socket.js';

let fetchingUsers = [];

export function getUser(user) {
  const localKnownPeople = mainStore.getState().people.knownPeople;
  if (Object.keys(localKnownPeople).includes(user)) {
    return localKnownPeople[user];
  }
  if (user != null && !fetchingUsers.includes(user) && user.includes("@")) {
    get_user_info(user);
    fetchingUsers.push(user);
  }
  return {"name": user, "picture": "/assets/images/default_profile_pic.png", "status": "", "online": false};
}


// This is one of my favorite files. Concise, useful, and handles null errors for me.
