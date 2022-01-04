import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from "react-router-dom";

import './MainPanel.css';
import MPDMs from './MainPanel/MPDMs';
import MPGroups from './MainPanel/MPGroups';
import MPHome from './MainPanel/MPHome';

import MPPopup from './MainPanel/MPPopup';

class MainPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mpClass: "MainPanel",
      specialEasing: true,
      panelType: "",
      panelData: ""
    };

    this.enableShrink = this.enableShrink.bind(this);
    this.disableShrink = this.disableShrink.bind(this);

    this.openPanel = this.openPanel.bind(this);
    this.closePanel = this.closePanel.bind(this);
  }

  enableShrink() {
    this.setState({ specialEasing: false });
    if (this.state.mpClass != "MainPanel MainPanelTransition MainPanelShrink") {
      this.setState({ mpClass: "MainPanel MainPanelTransition MainPanelShrink" });
    }
  }

  disableShrink() {
    if (this.state.mpClass == "MainPanel MainPanelTransition MainPanelShrink") {
      this.setState({ mpClass: "MainPanel MainPanelTransition" });
    }
  }

  openPanel(newType, newData, shrink=true) {
    if (!this.props.history.location.pathname.startsWith("/groups")) {
      this.enableShrink();
    }
    if (this.state.panelType != newType || this.state.panelData != newData) {
      this.setState({
        panelType: newType,
        panelData: newData
      });
    }
    
    this.props.setCloseButton(true);
  }

  closePanel() {
    this.disableShrink();
    this.setState({
      panelType: ""
    });

    this.props.setCloseButton(false);
  }

  render() {
    return (
      <div className={this.state.mpClass} style={this.state.specialEasing ? {transition: "opacity .3s cubic-bezier(0.65, 0, 0.35, 1), transform .3s cubic-bezier(0.65, 0, 0.35, 1)"} : null}>
        <Switch>
          <Route path="/dms/:chatEmail" component={MPDMs} />
          <Route path="/dms">
            <div style={{display: "table", width: "100%", height: "100%"}}>
              <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "20px", userSelect: "none"}}>Welcome to Strawberry DMs</h1>
            </div>
          </Route>
          <Route path="/groups/:threadID" render={routeProps => (<MPGroups opendialog={this.openPanel} {...routeProps} />)} />
          <Route path="/groups">
            <div style={{display: "table", width: "100%", height: "100%"}}>
              <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "20px", userSelect: "none"}}>
                Welcome to Strawberry Groups
              </h1>
            </div>
          </Route>
          <Route path="/home">
            <MPHome opendialog={this.openPanel} />
          </Route>
        </Switch>

        <MPPopup type={this.state.panelType} data={this.state.panelData} shrink={this.props.history.location.pathname.startsWith("/groups") ? false : true} onclose={this.closePanel} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  hideRightPanel: state.app.hideRightPanel
});

export default connect(mapStateToProps, null)(withRouter(MainPanel));
