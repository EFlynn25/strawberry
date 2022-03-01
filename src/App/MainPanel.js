import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from "react-router-dom";
import { Resizable } from "re-resizable";
import equal from 'fast-deep-equal/react';

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
      panelShrink: true, // Should the panel shrink?
      popoutWidths: {},
      popoutHeights: {},
    };

    this.enableShrink = this.enableShrink.bind(this);
    this.disableShrink = this.disableShrink.bind(this);

    this.openPanel = this.openPanel.bind(this);
    this.closePanel = this.closePanel.bind(this);

    this.popoutRefs = {}
  }

  componentDidMount() {
    this.updateRefs();
  }

  componentDidUpdate(prevProps) {
    this.updateRefs();
  }

  updateRefs() {
    this.popoutRefs = {};
    let newWidths = {};
    let newHeights = {};
    const refCreator = (item) => {
      this.popoutRefs[item] = React.createRef();
      if (!Object.keys(this.state.popoutWidths).includes(item) || !Object.keys(this.state.popoutHeights).includes(item)) {
        newWidths[item] = 350;
        newHeights[item] = 450;
      } else {
        newWidths[item] = this.state.popoutWidths[item];
        newHeights[item] = this.state.popoutHeights[item];
      }
    };

    this.props.popouts.forEach(refCreator);
    if (!equal(this.state.popoutWidths, newWidths) || !equal(this.state.popoutHeights, newHeights)) {
      this.setState({ popoutWidths: newWidths, popoutHeights: newHeights });
    }
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
        panelData: newData,
        panelShrink: shrink
      });
    }

    this.props.setCloseButton(true);
  }

  closePanel() { // Closes MPPopup...
    setTimeout(function() {
      if (this.updater.isMounted(this)) {
        this.setState({ panelShrink: true });
      }
    }.bind(this), 300);

    this.disableShrink();
    this.setState({
      panelType: ""
    });

    this.props.setCloseButton(false);
  }

  resizePopout(e, direction, ref, d) {
    const newWidths = this.state.popoutWidths;
    const newHeights = this.state.popoutHeights;
    const popoutName = ref.className;

    let newWidth = d.width;
    let currentWidth = 0;
    Object.keys(newWidths).forEach((item) => {
      currentWidth += 20;
      currentWidth += newWidths[item];
    });

    const maxWidth = window.innerWidth - 340;
    if (currentWidth + newWidth > maxWidth) {
      newWidth = maxWidth - currentWidth;
    }
    newWidths[popoutName] += newWidth;
    newHeights[popoutName] += d.height;
    this.setState({
      popoutWidths: newWidths,
      popoutHeights: newHeights,
    });
  }

  render() {
    return (
      <div className={this.state.mpClass} style={this.state.specialEasing ? {transition: "opacity .3s cubic-bezier(0.65, 0, 0.35, 1), transform .3s cubic-bezier(0.65, 0, 0.35, 1)"} : null}>
        <Switch>
          <Route path="/dms/:chatEmail" render={routeProps => (<MPDMs openedDM={this.props.openedDM} thisChat={this.props.chats[this.props.openedDM]} opendialog={this.openPanel} {...routeProps} />)} />
          <Route path="/dms">
            <div style={{position: "absolute", display: "table", width: "100%", height: "100%"}}>
              <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "20px", userSelect: "none"}}>
                Welcome to Strawberry DMs
              </h1>
            </div>
          </Route>
          <Route path="/groups/:threadID" render={routeProps => (<MPGroups openedThread={this.props.openedThread} thisThread={this.props.threads[this.props.openedThread]} opendialog={this.openPanel} {...routeProps} />)} />
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
            this.props.popouts.map((item) => {
              let width = 350;
              let height = 450;
              if (Object.keys(this.state.popoutWidths).includes(item)) {
                width = this.state.popoutWidths[item];
              }
              if (Object.keys(this.state.popoutHeights).includes(item)) {
                height = this.state.popoutHeights[item];
              }

              const mpObject = item.includes("@") ?
                <MPDMs openedDM={item} thisChat={this.props.chats[item]} opendialog={this.openPanel} changePopout={this.props.changePopout} popout={true} />
                : <MPGroups openedThread={item} thisThread={this.props.threads[item]} opendialog={this.openPanel} changePopout={this.props.changePopout} popout={true} />;
              return (
                <Resizable
                  className={item}
                  key={item}
                  style={{marginRight: "20px", zIndex: "2"}}
                  size={{ width: width, height: height }}
                  minWidth={250}
                  minHeight={340}
                  bounds="parent"
                  boundsByDirection={true}
                  enable={{top: true, right: false, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: true}}
                  ref={this.popoutRefs[item]}
                  onResizeStop={(e, direction, ref, d) => this.resizePopout(e, direction, ref, d)} >

                  { mpObject }
                </Resizable>
              )
            })
          }
        </div>

        <MPPopup type={this.state.panelType} data={this.state.panelData} shrink={this.state.panelShrink} onclose={this.closePanel} opendialog={this.openPanel} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  hideRightPanel: state.app.hideRightPanel,
  openedDM: state.dms.openedDM,
  openedThread: state.groups.openedThread,
  chats: state.dms.chats,
  threads: state.groups.threads,
});

export default connect(mapStateToProps, null)(withRouter(MainPanel));
