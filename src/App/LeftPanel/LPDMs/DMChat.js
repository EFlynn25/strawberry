import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import './DMChat.css';
import ethan from "../../../assets/images/ethan.webp"
import {
  setdmsOpenedChat
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
    this.setState({
      name: this.props.getknownPeople[cEmail].name,
      picture: this.props.getknownPeople[cEmail].picture
    })
  }

  handleClick(e) {
    e.preventDefault();
    console.log("[from " + this.props.chatEmail + "] clicked");
    this.props.setdmsOpenedChat(this.props.chatEmail);

    this.props.history.push("/dms/" + this.props.chatEmail);
  }

  render() {
    //console.log("[DMChat] [from " + this.props.chatEmail + "] selected: " + this.props.dmsOpenedChat)

    let opened = false;
    if (this.props.chatEmail == this.props.dmsOpenedChat) {
      opened = true;
    }

    let chatMessage = "";
    const myChatMessages = this.props.chats[this.props.chatEmail].messages;
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
        <h1 className="dmChatTitle">{this.state.name}</h1>
        <p className="dmChatMessage">{chatMessage}</p>
        <h1 className="dmChatTime">4:20 PM</h1>
        {opened ? <div className="dmChatSelected" /> : null}
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
    setdmsOpenedChat
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DMChat));
