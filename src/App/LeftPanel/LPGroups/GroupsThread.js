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
import { parseDate } from '../../../GlobalComponents/parseDate.js';

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
    const myThread =  this.props.threads[this.props.threadID];
    const myThreadMessages = myThread.messages;

    if (this.props.threadID == this.props.openedThread && myThreadMessages != null && myThreadMessages.length > 0) {
      let myDict = {};
      myDict[this.props.email] = myThreadMessages[myThreadMessages.length - 1].id;
      this.props.setThreadLastRead({"thread_id": this.props.threadID, "last_read": myDict});
    }
  }

  handleClick(e) {
    e.preventDefault();
    console.log("[from " + this.props.threadID + "] clicked");
    if (e.target.parentElement.className.baseVal == "dmChatPopout" || e.target.className.baseVal == "dmChatPopout") {
      this.props.changePopout("thread", this.props.threadID)
    } else {
      this.props.setOpenedThread(this.props.threadID);
      this.props.history.push("/groups/" + this.props.threadID);

      this.props.hideLeftPanel();
    }
  }

  render() {
    const myThread =  this.props.threads[this.props.threadID];
    const myThreadMessages = myThread.messages;

    let opened = false;
    if (this.props.threadID == this.props.openedThread) {
      opened = true;
    }

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

    let profilesDiv = null;
    if (myThread.people != null && myThread.people.length > 0) { // This if statement is also used in HomeNotifications...
      const person1 = getUser(myThread.people[0]);
      const person2 = getUser(myThread.people[1]);
      const person3 = getUser(myThread.people[2]);
      const person4 = getUser(myThread.people[3]);

      if (myThread.people.length == 1) {
        profilesDiv = (
          <div className="gtProfilesDiv">
            <img src={person1.picture} className="gtpdPFP" alt={person1.name} />
          </div>
        );
      } else if (myThread.people.length == 2) {
        profilesDiv = (
          <div className="gtProfilesDiv">
            <img src={person1.picture} className="gtpdPFP gtpd2people1" alt={person1.name} />
            <img src={person2.picture} className="gtpdPFP gtpd2people2" alt={person2.name} />
          </div>
        );
      } else if (myThread.people.length == 3) {
        profilesDiv = (
          <div className="gtProfilesDiv">
            <img src={person1.picture} className="gtpdPFP gtpd3people1" alt={person1.name} />
            <img src={person2.picture} className="gtpdPFP gtpd3people2" alt={person2.name} />
            <img src={person3.picture} className="gtpdPFP gtpd3people3" alt={person3.name} />
          </div>
        );
      } else if (myThread.people.length == 4) {
        profilesDiv = (
          <div className="gtProfilesDiv">
            <img src={person1.picture} className="gtpdPFP gtpd4people1" alt={person1.name} />
            <img src={person2.picture} className="gtpdPFP gtpd4people2" alt={person2.name} />
            <img src={person3.picture} className="gtpdPFP gtpd4people3" alt={person3.name} />
            <img src={person4.picture} className="gtpdPFP gtpd4people4" alt={person4.name} />
          </div>
        );
      } else if (myThread.people.length > 4) {
        let numberOfExtra = myThread.people.length - 3;
        profilesDiv = (
          <div className="gtProfilesDiv">
            <img src={person1.picture} className="gtpdPFP gtpd4people1" alt={person1.name} />
            <img src={person2.picture} className="gtpdPFP gtpd4people2" alt={person2.name} />
            <img src={person3.picture} className="gtpdPFP gtpd4people3" alt={person3.name} />
            <div className="gtpdPFP gtpd4people4 gtpdExtraDiv">
              <p className="gtpdExtraText">+{numberOfExtra}</p>
            </div>
          </div>
        );
      }
    }

    let threadMessage = "";
    let threadTime = "";
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
      }

      threadTime = parseDate(lastMessage.timestamp, "time");
    }

    let read = true;
    if (myThreadMessages != null && myThreadMessages.length > 0) { // Checks if messages exist
      if (myThread.lastRead[this.props.email] < myThreadMessages[myThreadMessages.length - 1].id || myThread.lastRead[this.props.email] == null) {
        read = false; // This if statement painstakingly checks if the user has read the last message.
      }
    } else {
      threadMessage = <i>No messages</i>;
      threadTime = null;
    }

    return (
      <div className="GroupsThread" onClick={this.handleClick} style={{backgroundPositionX: opened ? "0" : ""}}>
        { profilesDiv }
        <div className="gtTitleTimeFlexbox">
          <h1 className={read ? "gtTitle" : "gtTitle gtTitleUnread"}>{threadName}</h1>
          <h1 className={read ? "gtTime" : "gtTime gtUnread"}>{threadTime}</h1>
        </div>
        <p className={read ? "gtMessage" : "gtMessage gtUnread"} title={myThreadMessages != null && myThreadMessages.length > 0 ? threadMessage : null} style={systemMessage ? {fontStyle: "italic"} : null}>{threadMessage}</p>
        <div className="gtSelected" style={{transform: opened ? "none" : ""}} />
        {read ? null : <div className="gtUnreadNotify" />}
        <Popout className="dmChatPopout" />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.app.email,
  openedThread: state.groups.openedThread,
  threads: state.groups.threads,
  getknownPeople: state.people.knownPeople,
});

const mapDispatchToProps = {
  setOpenedThread,
  setThreadLastRead
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GroupsThread));
