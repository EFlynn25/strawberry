// I hope someone can try to understand this...
// My thought was to have the "...Message.js" files be like a wrapper
// for the "...DefaultMessage.js" files so that I can implement customizable
// messages in the future. The "...DefaultMessage.js" files JUST display what
// "...Message.js" files give them. (not really, but that was the hope)

// UPDATE: The system above is changing. I want Message files to just process
// IDs and pass down message arrays. All in_chat and typing stuff will be
// removed.


import React from 'react';
import { connect } from 'react-redux';
import equal from 'fast-deep-equal/react';

import './DMsMessage.css';
import { getUser } from '../../../GlobalComponents/getUser.js';
import DMsDefaultMessage from './DMsMessage/DMsDefaultMessage';
import DMsBreckanMessage from './DMsMessage/DMsBreckanMessage';

class DMsMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myIDs: [],
      messageEmail: "",
      messageName: "",
      messagePicture: "",
      messageList: [],
      messageElements: [],
    };
  }

  componentDidMount() {
    this.reloadData();
  }

  componentDidUpdate(prevProps, prevState) {
    const thisChat = this.props.thisChat;
    const prevCurrentChat = prevProps.thisChat;

    const messagesExist = thisChat.messages != null && thisChat.messages.length > 0;
    const chatChanged = !equal(prevCurrentChat.messages, thisChat.messages);
    const openedDMChanged = prevProps.openedDM != this.props.openedDM;

    const idsChanged = prevState.myIDs != this.state.myIDs;
    const themLastReadChanged = prevCurrentChat.lastRead.them != thisChat.lastRead.them;
    const inChatChanged = prevProps.inChat != this.props.inChat;
    const newSentMessage = prevCurrentChat.sendingMessages != thisChat.sendingMessages;
    if (messagesExist && (chatChanged || openedDMChanged)) {
      this.reloadData();
      this.reloadMessage(prevProps);
    } else {
      if (idsChanged || themLastReadChanged || inChatChanged || newSentMessage) {
        this.reloadMessage(prevProps);
      }
    }
  }

  reloadData() {
    const propsOpenedDM = this.props.openedDM;
    const myID = this.props.id;

    const myChat = this.props.thisChat;
    const myChatMessages = myChat.messages;
    const firstMessageID = myChatMessages[0].id;

    let ids = [];
    let from = "";

    if (!Array.isArray(myID)) {
      for (let i = myID - firstMessageID; true; i++) {
        if (from.length == 0) {
          from = myChatMessages[i].from;
        }

        if (myChatMessages[i].from != from) {
          break;
        }
        ids.push(i + firstMessageID);
        if (myChatMessages[i + 1] == null) {
          break;
        }
      }
    } else {
      from = myChatMessages[myID[0] - firstMessageID].from;
      ids = myID;
    }

    if (from == "me") {
      this.setState({
        myIDs: ids,
        messageEmail: this.props.myEmail,
        messageName: this.props.myName,
        messagePicture: this.props.myPicture,
      });
    } else if (from == "them") {
      const thisUser = getUser(propsOpenedDM);
      this.setState({
        myIDs: ids,
        messageEmail: propsOpenedDM,
        messageName: thisUser.name,
        messagePicture: thisUser.picture,
      });
    }
  }

  reloadMessage(prevProps) {
    let newMessageObjects = [];
    const thisChat = this.props.thisChat;
    const lastRead = thisChat.lastRead.them;
    const firstMessageID = thisChat.messages[0].id;
    // Only time will tell if we need the code below...

    // this.state.myIDs.filter(item => {
    //   const message = thisChat.messages[item - firstMessageID];
    //   if (message == null) {
    //     return false;
    //   }
    //   return true;
    // }).forEach(item => {
    this.state.myIDs.forEach(item => {
      const message = thisChat.messages[item - firstMessageID];
      const messageKey = "id" + item;

      let lr = false;
      let nt = false;
      const sendingMessagesExist = thisChat.sendingMessages && thisChat.sendingMessages.length > 0;
      if (lastRead != null && item == lastRead) {
        const simpleConditions = lastRead != thisChat.messages[thisChat.messages.length - 1].id || sendingMessagesExist;
        if (!this.props.inChat && simpleConditions) {
          lr = true;
        }
      }
      if (sendingMessagesExist) {
        nt = true;
      }

      const edited = message.edited != null ? message.edited : false;
      const messageObject = {
        message: message.message,
        timestamp: message.timestamp,
        lastRead: lr,
        noTransition: nt,
        id: item,
        edited: edited
      };
      newMessageObjects.push(messageObject);
    });

    const lastMessageID = thisChat.messages[thisChat.messages.length - 1].id;
    if (newMessageObjects[newMessageObjects.length - 1].id == lastMessageID
      && thisChat.sendingMessages != null && thisChat.sendingMessages.length > 0
      && this.state.messageEmail == this.props.myEmail) {

      let currentSendingID = 0;
      thisChat["sendingMessages"].forEach(item => {
        const messageObject = {message: item, lastRead: false, noTransition: true, sending: true, id: "sending" + currentSendingID, edited: false};
        newMessageObjects.push(messageObject);
        currentSendingID++;
      });
    }

    this.setState({ messageList: newMessageObjects });
  }

  render() {
    let MessageType;
    if (this.props.messageStyle == "default") {
      MessageType = DMsDefaultMessage;
    } else if (this.props.messageStyle == "breckan") {
      MessageType = DMsBreckanMessage;
    }

    return (
      <div className="DMsMessage">
        <MessageType
          openedDM={this.props.openedDM}
          email={this.state.messageEmail}
          name={this.state.messageName}
          picture={this.state.messagePicture}
          messages={this.state.messageList}
          onUpdate={this.props.onUpdate}
          editing={this.props.editing}
          setMessageEditing={this.props.setMessageEditing}
          opendialog={this.props.opendialog} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  myName: state.app.name,
  myEmail: state.app.email,
  myPicture: state.app.picture,
  knownPeople: state.people.knownPeople,
  messageStyle: state.app.messageStyle
});

export default connect(mapStateToProps, null)(DMsMessage);
