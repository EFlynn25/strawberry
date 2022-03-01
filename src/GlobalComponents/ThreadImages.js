import React from 'react';

import './ThreadImages.css';
import { getUser } from './getUser.js';

class ThreadImages extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const peopleList = this.props.people;
    let profilesDiv;

    const person1 = getUser(peopleList[0]);
    const person2 = getUser(peopleList[1]);
    const person3 = getUser(peopleList[2]);
    const person4 = getUser(peopleList[3]);

    if (peopleList.length == 1) {
      profilesDiv = (
        <div className="tiProfilesDiv">
          <img src={person1.picture} className="tiPFP" alt={person1.name} />
        </div>
      );
    } else if (peopleList.length == 2) {
      profilesDiv = (
        <div className="tiProfilesDiv">
          <img src={person1.picture} className="tiPFP ti2people1" alt={person1.name} />
          <img src={person2.picture} className="tiPFP ti2people2" alt={person2.name} />
        </div>
      );
    } else if (peopleList.length == 3) {
      profilesDiv = (
        <div className="tiProfilesDiv">
          <img src={person1.picture} className="tiPFP ti3people1" alt={person1.name} />
          <img src={person2.picture} className="tiPFP ti3people2" alt={person2.name} />
          <img src={person3.picture} className="tiPFP ti3people3" alt={person3.name} />
        </div>
      );
    } else if (peopleList.length == 4) {
      profilesDiv = (
        <div className="tiProfilesDiv">
          <img src={person1.picture} className="tiPFP ti4people1" alt={person1.name} />
          <img src={person2.picture} className="tiPFP ti4people2" alt={person2.name} />
          <img src={person3.picture} className="tiPFP ti4people3" alt={person3.name} />
          <img src={person4.picture} className="tiPFP ti4people4" alt={person4.name} />
        </div>
      );
    } else if (peopleList.length > 4) {
      let numberOfExtra = peopleList.length - 3;
      profilesDiv = (
        <div className="tiProfilesDiv">
          <img src={person1.picture} className="tiPFP ti4people1" alt={person1.name} />
          <img src={person2.picture} className="tiPFP ti4people2" alt={person2.name} />
          <img src={person3.picture} className="tiPFP ti4people3" alt={person3.name} />
          <div className="tiPFP ti4people4 tiExtraDiv">
            <p className="tiExtraText">+{numberOfExtra}</p>
          </div>
        </div>
      );
    }

    return profilesDiv;
  }
}

export default ThreadImages;
