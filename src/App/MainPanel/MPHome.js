import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import VisibilitySensor from 'react-visibility-sensor';

// import wlogo from '../../assets/icons/swhite.svg';
import { ReactComponent as SLogo } from '../../assets/icons/strawberry.svg';
import { ReactComponent as People } from '../../assets/icons/people.svg';
import { ReactComponent as Notify } from '../../assets/icons/notify.svg';
import { ReactComponent as Profile } from '../../assets/icons/profile.svg';
import { ReactComponent as Settings } from '../../assets/icons/settings.svg';
import './MPHome.css';
import {
  sethideRightPanel,
  setCurrentPage
} from '../../redux/userReducer';

import HomePeople from './MPHome/HomePeople';
import HomeNotifications from './MPHome/HomeNotifications';
import HomeProfile from './MPHome/HomeProfile';

class MPHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      homeClass: "MPHome",
      tab: 1,
      notifyClasses: "HomeNotifications hnHideRight"
    };

    this.transitionCheck = this.transitionCheck.bind(this);
    this.enableShrink = this.enableShrink.bind(this);
    this.disableShrink = this.disableShrink.bind(this);
  }

  componentDidMount() {
    // this.props.sethideRightPanel(true);
    this.props.setCurrentPage("Home");
  }

  componentDidUpdate(prevState) {
    let newClasses = "";
    if (this.state.tab == 1) {
      newClasses = "HomeNotifications hnHideRight";
    } else if (this.state.tab == 2) {
      newClasses = "HomeNotifications";
    } else if (this.state.tab == 3) {
      newClasses = "HomeNotifications hnHideLeft";
    }
    if (this.state.notifyClasses != newClasses) {
      this.setState({ notifyClasses: newClasses });
    }
  }

  componentWillUnmount() {
    // this.props.sethideRightPanel(false);
  }

  transitionCheck(isVisible) {
    if (isVisible && this.state.homeClass != "MPHome MPHomeTransition") {
      this.setState({
        homeClass: "MPHome MPHomeTransition"
      });
    }
  }

  enableShrink() {
    if (this.state.homeClass != "MPHome MPHomeTransition MPHomeShrink") {
      this.setState({ homeClass: "MPHome MPHomeTransition MPHomeShrink" });
    }
  }

  disableShrink() {
    if (this.state.homeClass == "MPHome MPHomeTransition MPHomeShrink") {
      this.setState({ homeClass: "MPHome MPHomeTransition" });
    }
  }

  render() {
    return (
      <VisibilitySensor onChange={this.transitionCheck}>
        <div className={this.state.homeClass}>
          <div className="homeWelcome">
            <img src={this.props.picture} className="hwPFP" alt={this.props.name} />
            <h1 className="hwName">Hey, {this.props.name}!</h1>
            <Settings className="hwSettingsIcon" />
          </div>

          <div className="homeTabs">
            <div className={this.state.tab == 1 ? "homeTab htSelected" : "homeTab"} onClick={() => this.setState({tab: 1})}>
              <People className={this.state.tab == 1 ? "homeTabIcon htiNotify htiSelected" : "homeTabIcon htiNotify"} />
              <h1 className={this.state.tab == 1 ? "homeTitle httSelected" : "homeTitle"}>PEOPLE</h1>
            </div>
            <div className={this.state.tab == 2 ? "homeTab htSelected" : "homeTab"} onClick={() => this.setState({tab: 2})}>
              <Notify className={this.state.tab == 2 ? "homeTabIcon htiNotify htiSelected" : "homeTabIcon htiNotify"} />
              <h1 className={this.state.tab == 2 ? "homeTitle httSelected" : "homeTitle"}>NOTIFICATIONS</h1>
            </div>
            <div className={this.state.tab == 3 ? "homeTab htSelected" : "homeTab"} onClick={() => this.setState({tab: 3})}>
              <Profile className={this.state.tab == 3 ? "homeTabIcon htiNotify htiSelected" : "homeTabIcon htiNotify"} />
              <h1 className={this.state.tab == 3 ? "homeTitle httSelected" : "homeTitle"}>PROFILE</h1>
            </div>
          </div>

          <div className="homeContent">
            {/*this.state.tab == 1 ? <HomePeople /> : null*/}
            {/*this.state.tab == 2 ? <HomeNotifications /> : null*/}
            {/*this.state.tab == 3 ? <HomeProfile /> : null*/}
            <HomePeople classes={this.state.tab == 1 ? "HomePeople" : "HomePeople HomePeopleHide"} opendialog={this.enableShrink} closedialog={this.disableShrink} />
            <HomeNotifications classes={this.state.notifyClasses} />
            <HomeProfile classes={this.state.tab == 3 ? "HomeProfile" : "HomeProfile HomeProfileHide"} />
          </div>
        </div>
      </VisibilitySensor>
    );
  }
}

const mapStateToProps = (state) => ({
  picture: state.user.picture,
  name: state.user.name
});

const mapDispatchToProps = {
  sethideRightPanel,
  setCurrentPage
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MPHome));
