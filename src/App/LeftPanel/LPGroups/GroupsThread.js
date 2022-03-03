import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import './GroupsThread.css';
import { ReactComponent as Popout } from '../../../assets/icons/popout.svg';
import {
  setOpenedThread,
  setThreadLastRead
} from "../../../redux/groupsReducer"
import { getUser } from '../../../GlobalComponents/getUser.js';
import { ParseDateLive } from '../../../GlobalComponents/parseDate.js';
import { isEmail, parseEmailToName } from '../../../GlobalComponents/smallFunctions.js';

import ThreadImages from '../../../GlobalComponents/ThreadImages';

class GroupsThread extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.updateData();
  }

  componentDidUpdate() {
    this.updateData();
  }

  updateData() {
    const myThread = this.props.thisThread;
    const myThreadMessages = myThread.messages;

    if (this.props.opened && this.props.dmsOrGroups == "groups" && myThreadMessages != null && myThreadMessages.length > 0) {
      let myDict = {};
      myDict[this.props.email] = myThreadMessages[myThreadMessages.length - 1].id;
      this.props.setThreadLastRead({"thread_id": this.props.threadID, "last_read": myDict});
    }
  }

  handleClick(e) {
    e.preventDefault();
    console.log("[from " + this.props.threadID + "] clicked");
    if (e.target.parentElement.className.baseVal == "dmChatPopout" || e.target.className.baseVal == "dmChatPopout") {
      this.props.changePopout(this.props.threadID);
    } else {
      this.props.setOpenedThread(this.props.threadID);
      this.props.history.push("/groups/" + this.props.threadID);

      this.props.hideLeftPanel();
    }
  }

  render() {
    const myThread = this.props.thisThread;
    const myThreadMessages = myThread.messages;
    const opened = this.props.opened;

    let threadName = "";
    if (myThread.name != null && myThread.name != "") {
      threadName = myThread.name;
    } else {
      if (myThread.people != null && myThread.people.length > 0) {
        // TODO: set thread name to something default
      } else {
        threadName = <i style={{color: "#FFFD"}}>No people</i>;
      }
    }

    // let profilesDiv = null;
    // if (myThread.people != null && myThread.people.length > 0) {
    //   <ThreadImages people={myThread.people} />
    // }

    let threadMessage = "";
    let timestamp;
    let systemMessage = false;
    if (Array.isArray(myThreadMessages) && myThreadMessages.length) { // If messages exist...
      const lastMessage = myThreadMessages[myThreadMessages.length - 1];
      let who = "";

      if (lastMessage.from == this.props.email) { // Add prefix to last message to show who sent it
        who = "You: "
      } else if (lastMessage.from != "system") {
        who = getUser(lastMessage.from).name.split(" ")[0] + ": " // Google Authentication does not give first/last name...
      }
      threadMessage = who + lastMessage["message"];

      if (lastMessage.from == "system") {
        systemMessage = true; // Used for special system message styling
        threadMessage = parseEmailToName(threadMessage);
      }

      timestamp = lastMessage.timestamp;
    }

    let read = true;
    if (myThreadMessages != null && myThreadMessages.length > 0) { // Checks if messages exist
      if (myThread.lastRead[this.props.email] < myThreadMessages[myThreadMessages.length - 1].id || myThread.lastRead[this.props.email] == null) {
        read = false; // This if statement painstakingly checks if the user has read the last message.
      }
    } else {
      threadMessage = <i>No messages</i>;
    }

    return (
      <div className="GroupsThread" onClick={this.handleClick} style={{backgroundPositionX: opened ? "0" : ""}}>
        { myThread.people != null && myThread.people.length > 0 ? <ThreadImages people={myThread.people} /> : null }
        <div className="gtTitleTimeFlexbox">
          <h1 className={read ? "gtTitle" : "gtTitle gtTitleUnread"}>{threadName}</h1>
          <h1 className={read ? "gtTime" : "gtTime gtUnread"}>{timestamp ? <ParseDateLive timestamp={timestamp} format="short"/> : null}</h1>
        </div>
        <p className={read ? "gtMessage" : "gtMessage gtUnread"} title={myThreadMessages != null && myThreadMessages.length > 0 ? threadMessage : null} style={systemMessage ? {fontStyle: "italic"} : null}>{threadMessage}</p>
        <div className="gtSelected" style={{transform: opened ? "none" : ""}} />
        {read ? null : <div className="gtUnreadNotify" />}
        { window.innerWidth > 880 ? <Popout className="dmChatPopout" /> : null }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.app.email,
  dmsOrGroups: state.app.dmsOrGroups,
});

const mapDispatchToProps = {
  setOpenedThread,
  setThreadLastRead
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GroupsThread));
