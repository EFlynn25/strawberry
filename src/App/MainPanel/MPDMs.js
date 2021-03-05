import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';

import './MPDMs.css';
import {
  setdmsOpenedChat,
  addMessage,
  setTempMessageInput
} from '../../redux/dmsReducer';
import ethan from "../../assets/images/ethan.webp"

class MPDMs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      messages: []
    };
    //this.baseState = this.state;

    this.messagesRef = React.createRef();
    this.inputRef = React.createRef();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.inputEnterPressed = this.inputEnterPressed.bind(this);
  }

  componentDidMount() {
    this.props.setdmsOpenedChat(this.props.match.params.chatEmail);

    console.log("[MPDMs]: componentDidMount with thread ID " + this.props.dmsOpenedChat);
    //this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
    if (this.props.dmsOpenedChat != "") {
      this.reloadMessages();

      const tmi = this.props.chats[this.props.dmsOpenedChat].tempMessageInput;
      if (tmi != "") {
        this.setState({
          inputValue: tmi
        });
      }
    }

    this.inputRef.current.focus();
  }

  componentDidUpdate(prevProps) {
    console.log("[MPDMs]: componentDidUpdate with thread ID " + this.props.dmsOpenedChat);
    const propsOpenedChat = this.props.dmsOpenedChat;
    if (prevProps.dmsOpenedChat != propsOpenedChat || prevProps.chats[propsOpenedChat] != this.props.chats[propsOpenedChat]) {
      this.reloadMessages();
      this.setState({inputValue: ""});
      this.inputRef.current.focus();
    }

    const thisChat = this.props.chats[this.props.dmsOpenedChat];
    if (thisChat != null) {
      const iv = this.state.inputValue
      const tmi = thisChat.tempMessageInput
      if (this.props.dmsOpenedChat != "" && prevProps.dmsOpenedChat != propsOpenedChat) {
        if (prevProps.dmsOpenedChat != "") {
          this.props.setTempMessageInput({
            chat: prevProps.dmsOpenedChat,
            input: iv
          });
        }

        this.setState({
          inputValue: tmi
        });
      }
    }
    this.inputRef.current.focus();
  }

  componentWillUnmount() {
    const iv = this.state.inputValue
    if (this.props.dmsOpenedChat != "") {
      this.props.setTempMessageInput({
        chat: this.props.dmsOpenedChat,
        input: iv
      });
    }
  }

  reloadMessages() {
    const thisChat = this.props.chats[this.props.dmsOpenedChat];
    //const startID = thisChat["messages"][0]["id"];
    //let nextID = startID;

    if (thisChat == null) {
      return false;
    }

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

        const newMessageName = messageFrom == "me" ? this.props.myName : this.props.getknownPeople[this.props.dmsOpenedChat].name;
        const newMessagePicture = messageFrom == "me" ? this.props.myPicture : this.props.getknownPeople[this.props.dmsOpenedChat].picture;
        const newMessage = (
          <div className="recieveMessage" key={"group" + i}>
          <img src={newMessagePicture} className="recieveMessagePFP" alt={newMessageName} />
            <h1 className="recieveMessageName">{newMessageName}</h1>
            <div className="recieveMessageGroup">
              {
                messageIDs.map(item => {
                  const message = thisChat["messages"].find( ({ id }) => id === item )["message"];
                  const messageKey = "id" + item;
                  console.debug("messageKey: " + messageKey);
                  const messageElement = <p key={messageKey} className="recieveMessageText">{message}</p>;
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
        <div className="dmsMessages" ref={this.messagesRef}>
          {this.state.messages}
        </div>
        <TextareaAutosize value={this.state.inputValue} onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} placeholder="Type message here" className="dmsMessagesInput" maxLength="2000" ref={this.inputRef} />
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
  getknownPeople: state.people.knownPeople
});

const mapDispatchToProps = {
  setdmsOpenedChat,
  addMessage,
  setTempMessageInput
}

export default connect(mapStateToProps, mapDispatchToProps)(MPDMs);
