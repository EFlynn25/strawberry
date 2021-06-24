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
      <div className="MainPanel" style={{width: this.props.hideRightPanel ? "calc(100% - 300px)" : "calc(100% - 600px)"}}>
        <Switch>
          <Route path="/dms/:chatEmail" component={MPDMs} />
          <Route path="/dms">
            <div style={{display: "table", width: "100%", height: "100%"}}>
              <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "20px"}}>Welcome to Strawberry DMs</h1>
            </div>
          </Route>
          <Route path="/groups">
            <div style={{display: "table", width: "100%", height: "100%"}}>
              <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "20px"}}>
                Welcome to Strawberry Groups
                <h1 style={{fontSize: "18px", color: "#fff3"}}>(not yet functional)</h1>
              </h1>
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

const mapStateToProps = (state) => ({
  hideRightPanel: state.app.hideRightPanel
});

export default connect(mapStateToProps, null)(MainPanel);
