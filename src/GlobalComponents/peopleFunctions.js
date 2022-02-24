import { getUser } from "./getUser.js";

export function alphabetizePeople(peopleList, noShowParam) {
  const noShow = noShowParam || [];

  if (peopleList.length > 0) {
    let alphabeticalPeople = [];
    peopleList.forEach(function (item, index) {
      if (!noShow.includes(item)) {
        alphabeticalPeople.push([item, getUser(item).name]);
      }
    });
    alphabeticalPeople.sort((a,b) => a[1].toUpperCase().localeCompare(b[1].toUpperCase()));
    const newPeople = alphabeticalPeople.map(function(x) {
        return x[0];
    });

    return newPeople;
  }
  return [];
}

export function searchPeople(peopleList, searchTerm) {
  const newPeople = peopleList.filter((item) => {
    const myUser = getUser(item);
    const email = item.toUpperCase();
    const name = myUser.name.toUpperCase();
    const iv = searchTerm.toUpperCase();
    return email.indexOf(iv) > -1 || name.indexOf(iv) > -1;
  });

  return newPeople;
}
