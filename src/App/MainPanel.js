import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from "react-router-dom";

import './MainPanel.css';
import MPDMs from './MainPanel/MPDMs'

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
            {/* Placeholder for no chat open */}
          </Route>
          <Route path="/groups">
            <h1 style={{color: "white", margin: "10px", fontSize: "20px"}}>Groups lol</h1>
          </Route>
        </Switch>
      </div>
    );
  }
}

export default MainPanel;
