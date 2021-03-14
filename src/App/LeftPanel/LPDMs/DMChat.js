import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import './DMChat.css';
import ethan from "../../../assets/images/ethan.webp"
import {
  setopenedChat,
  setLastRead
} from "../../../redux/dmsReducer"

class DMChat extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      name: "",
      picture: ""
    }
  }

  componentDidMount() {
    this.updateData();
  }

  componentDidUpdate() {
    this.updateData();
  }

  updateData() {
    const myChat =  this.props.chats[this.props.chatEmail];
    const myChatMessages = myChat.messages;

    if (this.props.chatEmail == this.props.openedChat && myChatMessages.length > 0) {
      this.props.setLastRead({"who": "me", "chat": this.props.chatEmail, "lastRead": myChatMessages[myChatMessages.length - 1].id});
    }

    const cEmail = this.props.chatEmail;
    const myPerson = this.props.getknownPeople[cEmail];
    if (myPerson != null) {
      if (this.state.name != myPerson.name || this.state.picture != myPerson.picture) {
        this.setState({
          name: myPerson.name,
          picture: myPerson.picture
        });
      }
    }
  }

  handleClick(e) {
    e.preventDefault();
    console.log("[from " + this.props.chatEmail + "] clicked");
    this.props.setopenedChat(this.props.chatEmail);

    this.props.history.push("/dms/" + this.props.chatEmail);
  }

  render() {
    //console.log("[DMChat] [from " + this.props.chatEmail + "] selected: " + this.props.openedChat)
    const myChat =  this.props.chats[this.props.chatEmail];
    const myChatMessages = myChat.messages;

    let opened = false;
    if (this.props.chatEmail == this.props.openedChat) {
      opened = true;
    }

    let chatMessage = "";
    if (Array.isArray(myChatMessages) && myChatMessages.length) {
      const lastMessage = myChatMessages[myChatMessages.length - 1];
      let you = "";

      if (lastMessage["from"] == "me") {
        you = "You: "
      }
      chatMessage = you + lastMessage["message"];
    }

    let chatTime = "4:20 PM";

    let read = true;
    if (myChatMessages.length > 0) {
      if (myChat.lastRead.me < myChatMessages[myChatMessages.length - 1].id || myChat.lastRead.me == null) {
        read = false;
      }
    } else {
      chatMessage = <i>No messages</i>
      chatTime = null;
    }

    return (
      <div className="DMChat" onClick={this.handleClick} style={{background: opened ? "linear-gradient(90deg, #282A2D 0%, transparent 100%)" : ""}}>
        <img src={this.state.picture} className="dmChatPFP" alt={this.state.name} />
        <h1 className={read ? "dmChatTitle" : "dmChatTitle dmChatTitleUnread"}>{this.state.name}</h1>
        <p className={read ? "dmChatMessage" : "dmChatMessage dmChatUnread"}>{chatMessage}</p>
        <h1 className={read ? "dmChatTime" : "dmChatTime dmChatUnread"}>{chatTime}</h1>
        {opened ? <div className="dmChatSelected" /> : null}
        {read ? null : <div className="dmChatUnreadNotify" />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  openedChat: state.dms.openedChat,
  chats: state.dms.chats,
  getknownPeople: state.people.knownPeople,
});

const mapDispatchToProps = {
    setopenedChat,
    setLastRead
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DMChat));
