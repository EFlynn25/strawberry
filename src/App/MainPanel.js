import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from "react-router-dom";
import { Resizable } from "re-resizable";

import './MainPanel.css';
import './MainPanel/MPConversation.css';
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
      panelType: "", // Type of panel (announcements, settings, etc.)
      panelData: "", // Special data passed to MPPopup, like a user's email when opening a user's profile
    };

    this.enableShrink = this.enableShrink.bind(this);
    this.disableShrink = this.disableShrink.bind(this);

    this.openPanel = this.openPanel.bind(this);
    this.closePanel = this.closePanel.bind(this);
  }

  enableShrink() { // Enables shrinking MainPanel when opening the MainPanel popup (MPPopup)
    this.setState({ specialEasing: false });
    if (this.state.mpClass != "MainPanel MainPanelTransition MainPanelShrink") {
      this.setState({ mpClass: "MainPanel MainPanelTransition MainPanelShrink" });
    }
  }

  disableShrink() { // Disables shrinking...
    if (this.state.mpClass == "MainPanel MainPanelTransition MainPanelShrink") {
      this.setState({ mpClass: "MainPanel MainPanelTransition" });
    }
  }

  openPanel(newType, newData, shrink=true) { // Opens the main panel popup (MPPopup)
    // This if statement enables shrinking MainPanel when not in Groups
    // because shrinking MainPanel for Groups settings looks weird
    if (shrink) {
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

  closePanel() { // Closes MPPopup...
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
          <Route path="/dms/:chatEmail" render={routeProps => (<MPDMs openedDM={this.props.openedDM} {...routeProps} />)} />
          <Route path="/dms">
            <div style={{position: "absolute", display: "table", width: "100%", height: "100%"}}>
              <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "20px", userSelect: "none"}}>
                Welcome to Strawberry DMs
              </h1>
            </div>
          </Route>
          <Route path="/groups/:threadID" render={routeProps => (<MPGroups opendialog={this.openPanel} openedThread={this.props.openedThread} {...routeProps} />)} />
          <Route path="/groups">
            <div style={{position: "absolute", display: "table", width: "100%", height: "100%"}}>
              <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "20px", userSelect: "none"}}>
                Welcome to Strawberry Groups
              </h1>
            </div>
          </Route>
          <Route path="/home">
            <MPHome opendialog={this.openPanel} />
          </Route>
        </Switch>

        <div className="mpPopouts">
          {
            this.props.chatPopouts.map((item) => {
              return (
                <Resizable
                  style={{marginRight: "20px"}}
                  defaultSize={{width: 350, height: 450}}
                  minWidth={250}
                  minHeight={340}
                  bounds="parent"
                  boundsByDirection={true}
                  enable={{top: true, right: false, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: true}}>

                  <MPDMs openedDM={item} changePopout={this.props.changePopout} popout={true} />
                </Resizable>
              )
            })
          }
          {
            this.props.threadPopouts.map((item) => {
              return (
                <Resizable
                  style={{marginRight: "20px"}}
                  defaultSize={{width: 350, height: 450}}
                  minWidth={250}
                  minHeight={340}
                  bounds="parent"
                  boundsByDirection={true}
                  enable={{top: true, right: false, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: true}}>

                  <MPGroups openedThread={item} opendialog={this.openPanel} changePopout={this.props.changePopout} popout={true} />
                </Resizable>
              )
            })
          }
        </div>

        <MPPopup type={this.state.panelType} data={this.state.panelData} shrink={this.props.history.location.pathname.startsWith("/groups") ? false : true} onclose={this.closePanel} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  hideRightPanel: state.app.hideRightPanel,
  openedDM: state.dms.openedDM,
  openedThread: state.groups.openedThread,
});

export default connect(mapStateToProps, null)(withRouter(MainPanel));
