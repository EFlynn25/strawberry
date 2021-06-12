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
    this.props.setdmsOrGroups("dms");
    if (this.props.history.location.pathname.startsWith("/groups")) {
      this.props.setdmsOrGroups("groups");
    }
  }

  render() {
    return (
      <div className="LeftPanel">
        <LPHome />
        <LPSeparator />
        <LPTabs />
        {this.props.dmsOrGroups == "dms" ? <LPDMs /> : <LPGroups />}
        {/*
        <Switch>
          <Route path="/groups">
            <LPGroups />
          </Route>
          <Route path="/dms">
            <LPDMs />
          </Route>
        </Switch>
      */}
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
