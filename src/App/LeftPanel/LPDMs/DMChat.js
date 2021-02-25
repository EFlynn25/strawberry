import React from 'react';
import { connect } from 'react-redux';

import './DMChat.css';
import ethan from "../../../assets/images/ethan.webp"
import {
  setdmsOpenedChat
} from "../../../redux/dmsReducer"

class DMChat extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    //this.state = {opened: false};
  }

  handleClick(e) {
    e.preventDefault();
    console.log("[from " + this.props.chatEmail + "] clicked");
    this.props.setdmsOpenedChat(this.props.chatEmail);
    //this.setState({opened: true});
  }

  render() {
    console.log("[from " + this.props.chatEmail + "] selected: " + this.props.dmsOpenedChat)

    let opened = false;
    if (this.props.chatEmail == this.props.dmsOpenedChat) {
      opened = true;
    }

    return (
      <div className="DMChat" onClick={this.handleClick} style={{background: opened ? "linear-gradient(90deg, #282A2D 0%, transparent 100%)" : ""}}>
        <img src={ethan} className="dmChatPFP" alt="Ethan Flynn" />
        <h1 className="dmChatTitle">Ethan Flynn</h1>
        <h1 className="dmChatMessage">You: lol you're a nerd lolololololololol hahaha</h1>
        <h1 className="dmChatTime">4:20 PM</h1>
        {opened ? <div className="dmChatSelected" /> : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dmsOpenedChat: state.dms.dmsOpenedChat
});

const mapDispatchToProps = {
    setdmsOpenedChat
}


export default connect(mapStateToProps, mapDispatchToProps)(DMChat);
