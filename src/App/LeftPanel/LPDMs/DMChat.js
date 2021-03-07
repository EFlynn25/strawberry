import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import './DMChat.css';
import ethan from "../../../assets/images/ethan.webp"
import {
  setdmsOpenedChat,
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
    const cEmail = this.props.chatEmail;
    const myPerson = this.props.getknownPeople[cEmail];
    if (myPerson != null) {
      this.setState({
        name: myPerson.name,
        picture: myPerson.picture
      });
    }
  }

  handleClick(e) {
    e.preventDefault();
    console.log("[from " + this.props.chatEmail + "] clicked");
    this.props.setdmsOpenedChat(this.props.chatEmail);

    this.props.history.push("/dms/" + this.props.chatEmail);
  }

  render() {
    //console.log("[DMChat] [from " + this.props.chatEmail + "] selected: " + this.props.dmsOpenedChat)
    const myChat =  this.props.chats[this.props.chatEmail];
    const myChatMessages = myChat.messages;

    let opened = false;
    if (this.props.chatEmail == this.props.dmsOpenedChat) {
      opened = true;
      this.props.setLastRead({"chat": this.props.chatEmail, "lastRead": myChatMessages[myChatMessages.length - 1].id});
    }

    let read = true;
    if (myChat.lastRead < myChatMessages[myChatMessages.length - 1].id || myChat.lastRead == null) {
      read = false;
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

    return (
      <div className="DMChat" onClick={this.handleClick} style={{background: opened ? "linear-gradient(90deg, #282A2D 0%, transparent 100%)" : ""}}>
        <img src={this.state.picture} className="dmChatPFP" alt={this.state.name} />
        <h1 className={read ? "dmChatTitle" : "dmChatTitle dmChatTitleUnread"}>{this.state.name}</h1>
        <p className={read ? "dmChatMessage" : "dmChatMessage dmChatUnread"}>{chatMessage}</p>
        <h1 className={read ? "dmChatTime" : "dmChatTime dmChatUnread"}>4:20 PM</h1>
        {opened ? <div className="dmChatSelected" /> : null}
        {read ? null : <div className="dmChatUnreadNotify" />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dmsOpenedChat: state.dms.dmsOpenedChat,
  chats: state.dms.chats,
  getknownPeople: state.people.knownPeople,
});

const mapDispatchToProps = {
    setdmsOpenedChat,
    setLastRead
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DMChat));