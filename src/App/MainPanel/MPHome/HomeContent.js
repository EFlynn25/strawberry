import React from 'react';

import { ReactComponent as Notify } from '../../../assets/icons/notify.svg';
import { ReactComponent as People } from '../../../assets/icons/people.svg';
import { ReactComponent as Profile } from '../../../assets/icons/profile.svg';
import './HomeContent.css';

class HomeContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 1
    };
  }

  render() {
    return (
      <div className="HomeContent">
        <div className="hcTabs">
          <div className={this.state.tab == 1 ? "hcTab hctSelected" : "hcTab"} onClick={() => this.setState({tab: 1})}>
            <Notify className={this.state.tab == 1 ? "hcTabIcon hctiNotify hctiSelected" : "hcTabIcon hctiNotify"} />
            <h1 className={this.state.tab == 1 ? "hcTitle hcttSelected" : "hcTitle"}>NOTIFICATIONS</h1>
          </div>
          <div className={this.state.tab == 2 ? "hcTab hctSelected" : "hcTab"} onClick={() => this.setState({tab: 2})}>
            <People className={this.state.tab == 2 ? "hcTabIcon hctiNotify hctiSelected" : "hcTabIcon hctiNotify"} />
            <h1 className={this.state.tab == 2 ? "hcTitle hcttSelected" : "hcTitle"}>PEOPLE</h1>
          </div>
          <div className={this.state.tab == 3 ? "hcTab hctSelected" : "hcTab"} onClick={() => this.setState({tab: 3})}>
            <Profile className={this.state.tab == 3 ? "hcTabIcon hctiNotify hctiSelected" : "hcTabIcon hctiNotify"} />
            <h1 className={this.state.tab == 3 ? "hcTitle hcttSelected" : "hcTitle"}>PROFILE</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeContent;
