import mainStore from '../redux/mainStore.js';

export function getUser(user) {
  const localKnownPeople = mainStore.getState().people.knownPeople;
  if (Object.keys(localKnownPeople).includes(user)) {
    return localKnownPeople[user]
  }
  return {"name": user, "picture": "/assets/images/default_profile_pic.png", "status": ""}
}
