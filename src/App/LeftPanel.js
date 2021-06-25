import React from 'react';
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
  componentDidMount() {
    let setTo = "dms";
    if (this.props.history.location.pathname.startsWith("/groups")) {
      setTo = "groups";
    }
    this.props.setdmsOrGroups(setTo);
  }

  render() {
    return (
      <div className="LeftPanel">
        <LPHome />
        <LPSeparator />
        {/*this.props.dmsOrGroups == "dms" ? <LPDMs /> : <LPGroups />*/}
        <div className="lpConversations">
          <LPTabs />
          <LPDMs mainClasses={this.props.dmsOrGroups == "dms" ? "LPDMs" : "LPDMs LPDMsHide"} />
          <LPGroups mainClasses={this.props.dmsOrGroups == "groups" ? "LPGroups" : "LPGroups LPGroupsHide"} />
        </div>
      </div>
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
