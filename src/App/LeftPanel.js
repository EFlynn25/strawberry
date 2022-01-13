import React, { Fragment } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import './LeftPanel.css';

import LPHome from './LeftPanel/LPHome'
import LPSeparator from './LeftPanel/LPSeparator'
import LPTabs from './LeftPanel/LPTabs'
import LPGroups from './LeftPanel/LPGroups'
import LPDMs from './LeftPanel/LPDMs'
import {
  setdmsOrGroups
} from "../redux/appReducer"

// import { Switch, Route } from "react-router-dom";

class LeftPanel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mobile: false // If this is true, LeftPanel will have a darkened background to put focus on itself
    }

    this.checkMobile = this.checkMobile.bind(this)
    window.addEventListener("resize", this.checkMobile);
  }

  componentDidMount() {
    let setTo = "dms";
    if (this.props.history.location.pathname.startsWith("/groups")) {
      setTo = "groups";
    }
    this.props.setdmsOrGroups(setTo);

    this.checkMobile()
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkMobile);
  }

  checkMobile() {
    console.log(window.innerWidth)
    if (window.innerWidth <= 880 && !this.state.mobile) {
      this.setState({ mobile: true });
    } else if (window.innerWidth > 880 && this.state.mobile) {
      this.setState({ mobile: false });
    }
  }

  render() {
    return (
      <Fragment>
        { !this.state.mobile ? null :
          <div className={this.props.showLeftPanel ? "lpMobileDarken" : "lpMobileDarken lpMobileDarkenHide"} onClick={this.props.hideLeftPanel}>
          </div>
        }
        <div className="LeftPanel" style={this.props.showLeftPanel ? {transform: "none"} : null}>
          <LPHome hideLeftPanel={this.props.hideLeftPanel} />
          <LPSeparator />
          {/*this.props.dmsOrGroups == "dms" ? <LPDMs /> : <LPGroups />*/}
          <div className="lpConversations">
            <LPTabs />
            <LPDMs mainClasses={this.props.dmsOrGroups == "dms" ? "LPDMs" : "LPDMs LPDMsHide"} hideLeftPanel={this.props.hideLeftPanel} />
            <LPGroups mainClasses={this.props.dmsOrGroups == "groups" ? "LPGroups" : "LPGroups LPGroupsHide"} hideLeftPanel={this.props.hideLeftPanel} />
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  dmsOrGroups: state.app.dmsOrGroups
});

const mapDispatchToProps = {
    setdmsOrGroups
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LeftPanel));
