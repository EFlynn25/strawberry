import React from 'react';

// import notify from '../../../assets/icons/notify.svg';
// import people from '../../../assets/icons/people.svg';
// import profile from '../../../assets/icons/profile.svg';
import { ReactComponent as Notify } from '../../../assets/icons/notify.svg';
import { ReactComponent as People } from '../../../assets/icons/people.svg';
import { ReactComponent as Profile } from '../../../assets/icons/profile.svg';
import './HomeContent.css';

class HomeContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="HomeContent">
        <div className="hcTabs">
          <div className="hcTab">
            {/*<img src={notify} className="hcTabIcon hctiNotify" alt="Notify Icon" />*/}
            <Notify className="hcTabIcon hctiNotify" />
            <h1 className="hcTitle">NOTIFICATIONS</h1>
          </div>
          <div className="hcTab">
            {/*<img src={people} className="hcTabIcon hctiPeople" alt="People Icon" />*/}
            <People className="hcTabIcon hctiPeople" />
            <h1 className="hcTitle">PEOPLE</h1>
          </div>
          <div className="hcTab">
            {/*<img src={profile} className="hcTabIcon hctiProfile" alt="Profile Icon" />*/}
            <Profile className="hcTabIcon hctiProfile" />
            <h1 className="hcTitle">PROFILE</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeContent;
