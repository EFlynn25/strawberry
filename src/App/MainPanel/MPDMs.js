import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';

import './MPDMs.css';
import {
  getdmsOpenedChat,
  getChats,
  setdmsOpenedChat,
  addMessage
} from '../../redux/dmsReducer';
import {
  getUserName,
  getUserEmail,
  getUserPicture
} from '../../redux/userReducer';
import ethan from "../../assets/images/ethan.webp"

class MPDMs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      inputHeight: 20,
      currentThreadID: 0,
      messages: []
    };

    this.messagesRef = React.createRef();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.inputEnterPressed = this.inputEnterPressed.bind(this);
  }

  componentDidMount() {
    this.props.setdmsOpenedChat(this.props.match.params.chatEmail);

    console.log("[MPDMs]: componentDidMount with thread ID " + this.props.dmsOpenedChat);
    //this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
    if (this.props.dmsOpenedChat != "") {
      this.reloadMessages();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("[MPDMs]: componentDidUpdate with thread ID " + this.props.dmsOpenedChat);
    const propsOpenedChat = this.props.dmsOpenedChat;
    if (prevProps.dmsOpenedChat != propsOpenedChat || prevProps.chats[propsOpenedChat] != this.props.chats[propsOpenedChat]) {
      this.reloadMessages();
    }
  }

  reloadMessages() {
    const thisChat = this.props.chats[this.props.dmsOpenedChat];
    //const startID = thisChat["messages"][0]["id"];
    //let nextID = startID;
    let nextID = thisChat["messages"][0]["id"];
    let tempMessages = [];
    thisChat["messages"].map((message, i) => {
      console.debug(message);

      if (message["id"] >= nextID) {
        let messageIDs = [message["id"]];
        const messageFrom = message["from"];
        console.debug("before while");
        while (true) {
          //if (thisChat["messages"] message["id"])
          const localNextID = messageIDs[messageIDs.length - 1] + 1;
          const findNextID = thisChat["messages"].find( ({ id }) => id === localNextID );

          console.debug("findNextID: " + findNextID);

          if (findNextID == null) {
            break;
          }

          if (findNextID["from"] == messageFrom) {
            messageIDs.push(localNextID);
            nextID = localNextID + 1;
          } else {
            break;
          }
        }
        console.debug("after while... " + messageIDs);

        const newMessage = (
          <div className="recieveMessage" key={"group" + i}>
          <img src={messageFrom == "me" ? this.props.myPicture : ethan} className="recieveMessagePFP" alt={this.props.myName} />
            <h1 className="recieveMessageName">{messageFrom == "me" ? this.props.myName : "Unknown"}</h1>
            <div className="recieveMessageGroup">
              {
                messageIDs.map(item => {
                  const message = thisChat["messages"].find( ({ id }) => id === item )["message"];
                  const messageKey = "id" + item;
                  console.debug("messageKey: " + messageKey);
                  const messageElement = <h1 key={messageKey} className="recieveMessageText">{message}</h1>;
                  return messageElement;
                })
              }
            </div>
            <h1 className="recieveMessageTimestamp">4:21 PM</h1>
          </div>
        );
        console.debug(newMessage);
        tempMessages.push(newMessage);
      }
    });

    this.setState({messages: tempMessages});
  }

  handleInputChange(event) {
    this.setState({
      inputValue: event.target.value
    });
  }

  inputEnterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13 && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();

      console.log("send: " + this.state.inputValue)
      this.props.addMessage({message: this.state.inputValue});
      this.setState({inputValue: ""});
    }
  }

  render() {
    return (
      <div className="MPDMs">
        {/*<h1 style={{color: "white", margin: "10px", fontSize: "20px"}}>Thread ID: {this.props.dmsOpenedChat}</h1>*/}
        <div className="dmsMessages" ref={this.messagesRef}>
          {this.state.messages}
        {/*
          <div className="recieveMessage">
            <img src={ethan} className="recieveMessagePFP" alt="Ethan Flynn" />
            <h1 className="recieveMessageName">Ethan Flynn</h1>
            <div className="recieveMessageGroup">
              <h1 className="recieveMessageText">tset</h1>
              <h1 className="recieveMessageText">hey im ethan, a total NERD lolololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololol</h1>
              <h1 className="recieveMessageText">I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry...</h1>
              <h1 className="recieveMessageText">noo it's past 420</h1>
              <h1 className="recieveMessageText">lol, you're in thread ID: {this.props.dmsOpenedChat}</h1>
            </div>
            <h1 className="recieveMessageTimestamp">4:21 PM</h1>
          </div>
          <div className="recieveMessage">
            <img src={ethan} className="recieveMessagePFP" alt="Ethan Flynn" />
            <h1 className="recieveMessageName">Ethan Flynn</h1>
            <div className="recieveMessageGroup">
              <h1 className="recieveMessageText">tset</h1>
              <h1 className="recieveMessageText">hey im ethan, a total NERD lolololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololol</h1>
              <h1 className="recieveMessageText">I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry...</h1>
              <h1 className="recieveMessageText">noo it's past 420</h1>
            </div>
            <h1 className="recieveMessageTimestamp">5:20 PM</h1>
          </div>
          <div className="recieveMessage">
            <img src={ethan} className="recieveMessagePFP" alt="Ethan Flynn" />
            <h1 className="recieveMessageName">Ethan Flynn</h1>
            <div className="recieveMessageGroup">
              <h1 className="recieveMessageText">tset</h1>
              <h1 className="recieveMessageText">hey im ethan, a total NERD lolololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololololol</h1>
              <h1 className="recieveMessageText">I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry... I gotta test this for Strawberry...</h1>
              <h1 className="recieveMessageText">noo it's past 420</h1>
            </div>
            <h1 className="recieveMessageTimestamp">6:20 PM</h1>
          </div>
          */}
        </div>
        <TextareaAutosize value={this.state.inputValue} onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} placeholder="Type message here" className="dmsMessagesInput" maxLength="2000" />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dmsOpenedChat: state.dms.dmsOpenedChat,
  chats: state.dms.chats,
  myName: state.user.name,
  myEmail: state.user.email,
  myPicture: state.user.picture,
});

const mapDispatchToProps = {
  setdmsOpenedChat,
  addMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(MPDMs);
