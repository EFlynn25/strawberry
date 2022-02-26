import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import './DMChat.css';
import { ReactComponent as Popout } from '../../../assets/icons/popout.svg';
import {
  setOpenedDM,
  setChatLastRead
} from "../../../redux/dmsReducer"
import { getUser } from '../../../GlobalComponents/getUser.js';
import { parseDate } from '../../../GlobalComponents/parseDate.js';

class DMChat extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.updateData();
  }

  /*
  shouldComponentUpdate(nextProps, nextState) {
    const openedDMChanged = (this.props.chatEmail == nextProps.openedDM && this.props.chatEmail != this.props.openedDM) || (this.props.chatEmail != nextProps.openedDM && this.props.chatEmail == this.props.openedDM);

    const thisChat = this.props.thisChat;
    const nextChat = nextProps.thisChat;
    let thisChatChanged = false;
    if (thisChat.messages && nextChat.messages) {
      // thisChatChanged = thisChat.messages[thisChat.messages.length - 1].id != nextChat.messages[nextChat.messages.length - 1].id;
      if (this.props.chatEmail == "fireno656@yahoo.com") {
        console.log(this.props);
        console.log(nextProps);
        console.log(thisChat);
        console.log(nextChat);
        console.log(thisChat.messages.length);
        console.log(nextChat.messages.length);
      }
      thisChatChanged = thisChat.messages.length != nextChat.messages.length;
    }
    if (thisChat.lastRead.me != nextChat.lastRead.me) {
      thisChatChanged = true;
    }

    const onlineChanged = this.props.chatEmail in this.props.knownPeople && nextProps.knownPeople[nextProps.chatEmail].online != this.props.knownPeople[this.props.chatEmail].online;

    if (openedDMChanged || thisChatChanged || onlineChanged) {
      return true;
    }

    return true;
    return false;
  }
  */

  componentDidUpdate() {
    this.updateData();
  }

  updateData() {
    const thisChat = this.props.thisChat;
    const myChatMessages = thisChat.messages;

    if (this.props.chatEmail == this.props.openedDM && myChatMessages != null && myChatMessages.length > 0) {
      this.props.setChatLastRead({"who": "me", "chat": this.props.chatEmail, "lastRead": myChatMessages[myChatMessages.length - 1].id});
    }
  }

  handleClick(e) {
    e.preventDefault();
    console.log("[from " + this.props.chatEmail + "] clicked");
    if (e.target.parentElement.className.baseVal == "dmChatPopout" || e.target.className.baseVal == "dmChatPopout") {
      this.props.changePopout(this.props.chatEmail);
    } else {
      this.props.setOpenedDM(this.props.chatEmail);
      this.props.history.push("/dms/" + this.props.chatEmail);

      this.props.hideLeftPanel();
    }
  }

  render() {
    const thisChat = this.props.thisChat;
    const myChatMessages = thisChat.messages;

    let opened = false;
    if (this.props.chatEmail == this.props.openedDM) {
      opened = true;
    }

    const myPerson = getUser(this.props.chatEmail);
    const chatName = myPerson.name;
    const chatPicture = myPerson.picture;
    const chatOnline = myPerson.online;

    let chatMessage = "";
    let chatTime = "";
    if (Array.isArray(myChatMessages) && myChatMessages.length) { // Checks if messages exist
      const lastMessage = myChatMessages[myChatMessages.length - 1];
      let you = "";

      if (lastMessage["from"] == "me") { // I took the inspiration of using "You: " as a prefix from Google Hangouts (my favorite messaging app)
        you = "You: "
      }
      chatMessage = you + lastMessage["message"];

      chatTime = parseDate(lastMessage.timestamp, "time");
    }

    let read = true;
    if (myChatMessages != null && myChatMessages.length > 0) {
      if (thisChat.lastRead.me < myChatMessages[myChatMessages.length - 1].id || thisChat.lastRead.me == null) {
        read = false;
      }
    } else {
      chatMessage = <i>No messages</i>;
      chatTime = null;
    }

    return (
      <div className="DMChat" onClick={this.handleClick} style={{backgroundPositionX: opened ? "0" : ""}}>
        <img src={chatPicture} className="dmChatPFP" alt={chatName} style={{boxShadow: opened ? "none" : ""}} />
        { chatOnline ? <div className="dmChatOnline"></div> : null }
        <div className="dmChatTitleTimeFlexbox">
          <h1 className={read ? "dmChatTitle" : "dmChatTitle dmChatTitleUnread"}>{chatName}</h1>
          <h1 className={read ? "dmChatTime" : "dmChatTime dmChatUnread"}>{chatTime}</h1>
        </div>
        <p className={read ? "dmChatMessage" : "dmChatMessage dmChatUnread"} title={chatMessage}>{chatMessage}</p>
        <div className="dmChatSelected" style={{transform: opened ? "none" : ""}} />
        { read ? null : <div className="dmChatUnreadNotify" /> }
        { window.innerWidth > 880 ? <Popout className="dmChatPopout" /> : null }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  openedDM: state.dms.openedDM,
  knownPeople: state.people.knownPeople,
});

const mapDispatchToProps = {
  setOpenedDM,
  setChatLastRead
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DMChat));
