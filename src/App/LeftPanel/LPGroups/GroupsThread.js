import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import './GroupsThread.css';
import {
  setOpenedThread,
  // setLastRead
} from "../../../redux/groupsReducer"

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
      // this.props.setLastRead({"who": "me", "thread": this.props.threadID, "lastRead": myThreadMessages[myThreadMessages.length - 1].id});
    }
  }

  handleClick(e) {
    e.preventDefault();
    console.log("[from " + this.props.threadID + "] clicked");
    this.props.setOpenedThread(this.props.threadID);

    this.props.history.push("/groups/" + this.props.threadID);
  }

  parseDate(timestamp) {
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(timestamp * 1000);

    let month = shortMonths[date.getMonth()];
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const timeString = hours + ':' + minutes + ' ' + ampm;
    const fullString = month + ' ' + date.getDate() + ', ' + date.getFullYear() + ' • ' + hours + ':' + minutes + ' ' + ampm;

    return(timeString);
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
      if (myThread.people.length > 0) {

      } else {
        threadName = <i style={{color: "#FFFD"}}>No people</i>;
      }
      // set thread name to something default
    }

    let profilesDiv = null;
    if (myThread.people != null && myThread.people.length > 0) {
      const person1 = this.props.getknownPeople[myThread.people[0]];
      const person2 = this.props.getknownPeople[myThread.people[1]];
      const person3 = this.props.getknownPeople[myThread.people[2]];
      const person4 = this.props.getknownPeople[myThread.people[3]];
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
    if (Array.isArray(myThreadMessages) && myThreadMessages.length) {
      const lastMessage = myThreadMessages[myThreadMessages.length - 1];
      let you = "";

      if (lastMessage.from == this.props.email) {
        you = "You: "
      }
      threadMessage = you + lastMessage["message"];

      threadTime = this.parseDate(lastMessage.timestamp);
    }

    let read = true;
    if (myThreadMessages != null && myThreadMessages.length > 0) {
      if (myThread.lastRead[this.props.email] < myThreadMessages[myThreadMessages.length - 1].id || myThread.lastRead[this.props.email] == null) {
        read = false;
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
        <p className={read ? "gtMessage" : "gtMessage gtUnread"} title={threadMessage}>{threadMessage}</p>
        <div className="gtSelected" style={{transform: opened ? "none" : ""}} />
        {read ? null : <div className="gtUnreadNotify" />}
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
  // setLastRead
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GroupsThread));
