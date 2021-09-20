import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import './DMChat.css';
import {
  setOpenedDM,
  setChatLastRead
} from "../../../redux/dmsReducer"
import { getUser } from '../../../GlobalComponents/getUser.js';

class DMChat extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.updateData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log("SHOULD I UPDATE?!");
    const openedDMChanged = (this.props.chatEmail == nextProps.openedDM && this.props.chatEmail != this.props.openedDM) || (this.props.chatEmail != nextProps.openedDM && this.props.chatEmail == this.props.openedDM);

    const thisChat = this.props.chats[this.props.chatEmail];
    const nextChat = nextProps.chats[this.props.chatEmail];
    let thisChatChanged = false;
    if (thisChat.messages && nextChat.messages) {
      thisChatChanged = thisChat.messages[thisChat.messages.length - 1].id != nextChat.messages[nextChat.messages.length - 1].id;
    }
    if (thisChat.lastRead.me != nextChat.lastRead.me) {
      thisChatChanged = true;
    }

    // console.groupCollapsed(this.props.chatEmail);
    // console.log(thisChat);
    // console.log(nextChat);
    // console.log(thisChat.messages[thisChat.messages.length - 1].id);
    // console.log(nextChat.messages[nextChat.messages.length - 1].id);
    // console.groupEnd();

    if (openedDMChanged || thisChatChanged) {
      return true;
    }

    return false;
  }

  componentDidUpdate() {
    this.updateData();
  }

  updateData() {
    const myChat =  this.props.chats[this.props.chatEmail];
    const myChatMessages = myChat.messages;

    if (this.props.chatEmail == this.props.openedDM && myChatMessages != null && myChatMessages.length > 0) {
      this.props.setChatLastRead({"who": "me", "chat": this.props.chatEmail, "lastRead": myChatMessages[myChatMessages.length - 1].id});
    }
  }

  handleClick(e) {
    e.preventDefault();
    console.log("[from " + this.props.chatEmail + "] clicked");
    this.props.setOpenedDM(this.props.chatEmail);

    this.props.history.push("/dms/" + this.props.chatEmail);
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
    const myChat =  this.props.chats[this.props.chatEmail];
    const myChatMessages = myChat.messages;

    let opened = false;
    if (this.props.chatEmail == this.props.openedDM) {
      opened = true;
    }

    let chatName = "";
    let chatPicture = "";
    // const myPerson = this.props.getknownPeople[this.props.chatEmail];
    const myPerson = getUser(this.props.chatEmail);
    if (myPerson != null) {
      chatName = myPerson.name;
      chatPicture = myPerson.picture;
    }

    let chatMessage = "";
    let chatTime = "";
    if (Array.isArray(myChatMessages) && myChatMessages.length) {
      const lastMessage = myChatMessages[myChatMessages.length - 1];
      let you = "";

      if (lastMessage["from"] == "me") {
        you = "You: "
      }
      chatMessage = you + lastMessage["message"];

      chatTime = this.parseDate(lastMessage.timestamp);
    }

    let read = true;
    if (myChatMessages != null && myChatMessages.length > 0) {
      if (myChat.lastRead.me < myChatMessages[myChatMessages.length - 1].id || myChat.lastRead.me == null) {
        read = false;
      }
    } else {
      chatMessage = <i>No messages</i>;
      chatTime = null;
    }

    // <div className="DMChat" onClick={this.handleClick} style={{background: opened ? "linear-gradient(90deg, #282A2D 0%, transparent 100%)" : ""}}>
    return (
      <div className="DMChat" onClick={this.handleClick} style={{backgroundPositionX: opened ? "0" : ""}}>
        <img src={chatPicture} className="dmChatPFP" alt={chatName} style={{boxShadow: opened ? "none" : ""}} />
        <div className="dmChatTitleTimeFlexbox">
          <h1 className={read ? "dmChatTitle" : "dmChatTitle dmChatTitleUnread"}>{chatName}</h1>
          <h1 className={read ? "dmChatTime" : "dmChatTime dmChatUnread"}>{chatTime}</h1>
        </div>
        <p className={read ? "dmChatMessage" : "dmChatMessage dmChatUnread"} title={chatMessage}>{chatMessage}</p>
        <div className="dmChatSelected" style={{transform: opened ? "none" : ""}} />
        {read ? null : <div className="dmChatUnreadNotify" />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  openedDM: state.dms.openedDM,
  chats: state.dms.chats,
  getknownPeople: state.people.knownPeople,
});

const mapDispatchToProps = {
    setOpenedDM,
    setChatLastRead
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DMChat));
