import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import './LPTabs.css';
import {
  setdmsOrGroups
} from "../../redux/appReducer"

class LPTabs extends React.Component {
  constructor(props) {
    super(props);

    this.dmsHandleClick = this.dmsHandleClick.bind(this);
    this.groupsHandleClick = this.groupsHandleClick.bind(this);
  }

  dmsHandleClick(e) {
    e.preventDefault();
    if (this.props.history.location.pathname != "/home") {
      if (this.props.openedDM != "") {
        this.props.history.push("/dms/" + this.props.openedDM);
      } else {
        this.props.history.push("/dms");
      }
    }
    this.props.setdmsOrGroups("dms");
  }

  groupsHandleClick(e) {
    e.preventDefault();
    if (this.props.history.location.pathname != "/home") {
      if (this.props.openedThread != null) {
        this.props.history.push("/groups/" + this.props.openedThread);
      } else {
        this.props.history.push("/groups");
      }
    }
    this.props.setdmsOrGroups("groups");
  }

  render() {
    const dmsUnread = Object.keys(this.props.chats).some((item) => {
      const myChat = this.props.chats[item];
      const myChatMessages = myChat.messages;
      if (myChatMessages != null && myChatMessages.length > 0) {
        if (myChat.lastRead.me < myChatMessages[myChatMessages.length - 1].id || myChat.lastRead.me == null) {
          return true;
        }
      }
    });

    const groupsUnread = Object.keys(this.props.threads).some((item) => {
      const myThread = this.props.threads[item];
      const myThreadMessages = myThread.messages;
      if (myThreadMessages != null && myThreadMessages.length > 0) {
        if (myThread.lastRead[this.props.email] < myThreadMessages[myThreadMessages.length - 1].id || myThread.lastRead[this.props.email] == null) {
          return true;
        }
      }
    });


    return (
      <div className="LPTabs">
        <div className="dmTab" onClick={this.dmsHandleClick}>
          <div className="dmTabInner">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="dmIcon">
              <defs>
                <linearGradient
                  id="dmIconGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#0078D4" stopOpacity="1" />
                  <stop offset="100%" stopColor="#1540C2" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            <h1 className="dmText" style={{fontWeight: this.props.dmsOrGroups == "dms" ? "700" : "500"}}>DMs</h1>
          </div>
          <div className="tabUnread" style={dmsUnread ? null : {display: "none"}} />
          <div className={this.props.dmsOrGroups == "dms" ? "dmSelected" : "dmHovering"} />
        </div>
        <div className="groupsTab" onClick={this.groupsHandleClick}>
          <div className="groupsTabInner">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="groupsIcon">
              <defs>
                <linearGradient
                  id="groupsIconGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#6AE292" stopOpacity="1" />
                  <stop offset="100%" stopColor="#1D9545" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
            </svg>
            <h1 className="groupsText" style={{fontWeight: this.props.dmsOrGroups == "groups" ? "700" : "500"}}>Groups</h1>
          </div>
          <div className="tabUnread" style={groupsUnread ? null : {display: "none"}} />
          <div className={this.props.dmsOrGroups == "groups" ? "groupsSelected" : "groupsHovering"} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.app.email,
  dmsOrGroups: state.app.dmsOrGroups,
  openedDM: state.dms.openedDM,
  openedThread: state.groups.openedThread,
  threads: state.groups.threads,
  chats: state.dms.chats,
});

const mapDispatchToProps = {
  setdmsOrGroups
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LPTabs));
