import React, { Fragment } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import './LeftPanel.css';
import { ReactComponent as Close } from '../assets/icons/close.svg';

import LPHome from './LeftPanel/LPHome'
import LPSeparator from './LeftPanel/LPSeparator'
import LPTabs from './LeftPanel/LPTabs'
import LPGroups from './LeftPanel/LPGroups'
import LPDMs from './LeftPanel/LPDMs'
import { setAppState } from "../redux/appReducer"
import { setOpenedDM } from "../redux/dmsReducer"
import { setOpenedThread } from "../redux/groupsReducer"

// import { Switch, Route } from "react-router-dom";

class LeftPanel extends React.Component {
  constructor(props) {
    super(props)

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.setList = this.setList.bind(this);

    window.addEventListener("keydown", this.handleKeyDown);

    this.dmsList = [];
    this.groupsList = [];
  }

  componentDidMount() {
    let setTo = "dms";
    if (this.props.history.location.pathname.startsWith("/groups")) {
      setTo = "groups";
    }
    this.props.setAppState({ dmsOrGroups: setTo });
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  setList(type, list) {
    this[type + "List"] = list;
  }

  handleKeyDown(e) { // This method sets up the Ctrl+UpArrow and Ctrl+DownArrow shortcuts
    const dmsOrGroups = this.props.dmsOrGroups;
    const dmsOrGroupsReady = dmsOrGroups == "dms" || dmsOrGroups == "groups";
    if (!e.ctrlKey || e.repeat || !dmsOrGroupsReady) {
      return false;
    }
    const which = e.which;

    const leftOrRight = which === 37 || which === 39;
    if (leftOrRight) {
      e.preventDefault();
      e.stopPropagation();
      const newLink = dmsOrGroups === "dms" ? "groups" : "dms";
      const nextOne = which === 37 ? "dms" : "groups";
      if (newLink == nextOne) {
        const openedExtension = newLink == "dms" ? "DM" : "Thread";
        const opened = this.props["opened" + openedExtension];
        if (this.props.history.location.pathname != "/home") {
          if (opened != null && opened != "") {
            this.props.history.push("/" + newLink + "/" + opened);
          } else {
            this.props.history.push("/" + newLink);
          }
        }
        this.props.setAppState({ dmsOrGroups: newLink });
      }
    }

    let myList = this[dmsOrGroups + "List"];
    const openedExtension = dmsOrGroups == "dms" ? "DM" : "Thread";
    const opened = this.props["opened" + openedExtension];

    let newConversation;

    if (which === 38) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.props.history.location.pathname.startsWith("/home")) {
        const myIndex = myList.indexOf(opened);

        if (myIndex != 0) {
          newConversation = myList[myIndex - 1];
        } else {
          this.props.history.push("/home");
        }
      }

    } else if (which === 40) {
      e.preventDefault();
      e.stopPropagation();

      if (this.props.history.location.pathname.startsWith("/home")) {
        newConversation = myList[0];
      } else {
        const myIndex = myList.indexOf(opened);
        if (myIndex != myList.length - 1) {
          newConversation = myList[myIndex + 1];
        }
      }

    }
    if (newConversation == null) {
      return false;
    }
    if (dmsOrGroups == "dms") {
      this.props.setOpenedDM(newConversation);
      this.props.history.push("/dms/" + newConversation);
    } else if (dmsOrGroups == "groups") {
      this.props.setOpenedThread(newConversation);
      this.props.history.push("/groups/" + newConversation);
    }
  }

  render() {
    return (
      <Fragment>
        { !this.props.mobile ? null :
          <div className={this.props.showLeftPanel ? "lpMobileDarken" : "lpMobileDarken lpMobileDarkenHide"} onClick={this.props.hideLeftPanel}></div>
        }
        <div className="LeftPanel" style={this.props.showLeftPanel ? {transform: "none"} : null}>
          <LPHome hideLeftPanel={this.props.hideLeftPanel} />
          <LPSeparator />
          {/*this.props.dmsOrGroups == "dms" ? <LPDMs /> : <LPGroups />*/}
          <div className="lpConversations">
            <LPTabs />
            <LPDMs
              mainClasses={this.props.dmsOrGroups == "dms" ? "LPDMs" : "LPDMs LPDMsHide"}
              hideLeftPanel={this.props.hideLeftPanel}
              changePopout={this.props.changePopout}
              setList={this.setList} />
            <LPGroups
              mainClasses={this.props.dmsOrGroups == "groups" ? "LPGroups" : "LPGroups LPGroupsHide"}
              hideLeftPanel={this.props.hideLeftPanel}
              changePopout={this.props.changePopout}
              setList={this.setList} />
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  dmsOrGroups: state.app.dmsOrGroups,
  mobile: state.app.mobile,
  openedDM: state.dms.openedDM,
  openedThread: state.groups.openedThread,
});

const mapDispatchToProps = {
  setAppState,
  setOpenedDM,
  setOpenedThread
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LeftPanel));
