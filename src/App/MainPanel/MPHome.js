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
import { ReactComponent as Announcements } from '../../assets/icons/announcements.svg';
import './MPHome.css';
import {
  sethideRightPanel,
  setCurrentPage
} from '../../redux/appReducer';
import { get_announcements } from '../../socket.js';

import HomePeople from './MPHome/HomePeople';
import HomeNotifications from './MPHome/HomeNotifications';
import HomeProfile from './MPHome/HomeProfile';

class MPHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      homeClass: "MPHome",
      specialEasing: true,
      tab: 1,
      notifyClasses: "HomeNotifications hnHideRight",
      // showAnnouncementsPanel: false,
      panelType: "",
      panelData: ""
    };

    this.transitionCheck = this.transitionCheck.bind(this);
  }

  componentDidMount() {
    this.props.setCurrentPage("Home");
    if (!this.props.announcements || Object.keys(this.props.announcements).length <= 0) {
      get_announcements();
    }
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

  transitionCheck(isVisible) {
    if (isVisible && this.state.homeClass != "MPHome MPHomeTransition") {
      this.setState({
        homeClass: "MPHome MPHomeTransition"
      });
    }
  }

  render() {
    return (
      <VisibilitySensor onChange={this.transitionCheck}>
        <div className={this.state.homeClass} style={this.state.specialEasing ? {transition: "opacity .3s cubic-bezier(0.65, 0, 0.35, 1), transform .3s cubic-bezier(0.65, 0, 0.35, 1)"} : null}>
          <div className="homeWelcome">
            <img src={this.props.picture} className="hwPFP" alt={this.props.name} />
            <h1 className="hwName">Hey, {this.props.name}!</h1>
            <Settings className="hwSettingsIcon hwTopRightIcon" onClick={() => this.props.opendialog("settings", "")} />
            <Announcements className="hwAnnouncementsIcon hwTopRightIcon" onClick={() => this.props.opendialog("announcements", "")} />
            { this.props.announcementsRead.length >= Object.keys(this.props.announcements).length ? null :
              <div className="hwAnnouncementsUnread hwTopRightIcon">
                <div className="hwUnreadDot" style={{top: "-2.5px", right: "-2.5px"}}></div>
              </div>
            }
          </div>

          <div className="homeTabs">
            <div className={this.state.tab == 1 ? "homeTab htSelected" : "homeTab"} onClick={() => this.setState({tab: 1})}>
              <People className={this.state.tab == 1 ? "homeTabIcon htiNotify htiSelected" : "homeTabIcon htiNotify"} />
              <h1 className={this.state.tab == 1 ? "homeTitle httSelected" : "homeTitle"}>PEOPLE</h1>
            </div>
            <div className={this.state.tab == 2 ? "homeTab htSelected" : "homeTab"} onClick={() => this.setState({tab: 2})}>
              <Notify className={this.state.tab == 2 ? "homeTabIcon htiNotify htiSelected" : "homeTabIcon htiNotify"} />
              <h1 className={this.state.tab == 2 ? "homeTitle httSelected" : "homeTitle"}>NOTIFICATIONS</h1>
              { this.state.tab != 2 && (this.props.dms_requests.length > 0 || Object.keys(this.props.groups_requests).length > 0 || Object.keys(this.props.announcements).includes("welcome") && !this.props.announcementsRead.includes("welcome")) ?
                <div className="hwNotificationsUnread">
                  <div className="hwUnreadDot"></div>
                </div>
                : null
              }
            </div>
            <div className={this.state.tab == 3 ? "homeTab htSelected" : "homeTab"} onClick={() => this.setState({tab: 3})}>
              <Profile className={this.state.tab == 3 ? "homeTabIcon htiNotify htiSelected" : "homeTabIcon htiNotify"} />
              <h1 className={this.state.tab == 3 ? "homeTitle httSelected" : "homeTitle"}>PROFILE</h1>
            </div>
          </div>

          <div className="homeContent">
            <HomePeople classes={this.state.tab == 1 ? "HomePeople" : "HomePeople HomePeopleHide"} opendialog={this.props.opendialog} />
            <HomeNotifications classes={this.state.notifyClasses} opendialog={this.props.opendialog} />
            <HomeProfile classes={this.state.tab == 3 ? "HomeProfile" : "HomeProfile HomeProfileHide"} />
          </div>
        </div>
      </VisibilitySensor>
    );
  }
}

const mapStateToProps = (state) => ({
  picture: state.app.picture,
  name: state.app.name,
  announcements: state.app.announcements,
  announcementsRead: state.app.announcementsRead,
  dms_requests: state.dms.requests,
  groups_requests: state.groups.requests,
});

const mapDispatchToProps = {
  sethideRightPanel,
  setCurrentPage
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MPHome));
