import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from "react-router-dom";

import './MainPanel.css';
import MPDMs from './MainPanel/MPDMs'
import MPHome from './MainPanel/MPHome'

class MainPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="MainPanel">
        <Switch>
          <Route path="/dms/:chatEmail" component={MPDMs} />
          <Route path="/dms">
            <div style={{display: "table", width: "100%", height: "100%"}}>
              <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "20px"}}>Welcome to Strawberry DMs</h1>
            </div>
          </Route>
          <Route path="/groups">
            <div style={{display: "table", width: "100%", height: "100%"}}>
              <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "20px"}}>Welcome to Strawberry Groups</h1>
            </div>
          </Route>
          <Route path="/home">
            <MPHome />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default MainPanel;
