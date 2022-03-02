// I hope someone can try to understand this...
// My thought was to have the "...Message.js" files be like a wrapper
// for the "...DefaultMessage.js" files so that I can implement customizable
// messages in the future. The "...DefaultMessage.js" files JUST display what
// "...Message.js" files give them. (not really, but that was the hope)

import React from 'react';
import { connect } from 'react-redux';
import equal from 'fast-deep-equal/react';

import './DMsMessage.css';
import { getUser } from '../../../GlobalComponents/getUser.js';
import { parseDate } from '../../../GlobalComponents/parseDate.js';
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
      inChat: "no",
      inChatNoTransition: true,
      inChatTyping: false,
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
    const otherUserStateChanged = prevProps.inChat != this.props.inChat || prevProps.typing != this.props.typing;
    const newSentMessage = prevCurrentChat.sendingMessages != thisChat.sendingMessages;
    if (messagesExist && (chatChanged || openedDMChanged)) {
      this.reloadData();
      this.reloadMessage(prevProps);
    } else {
      if (idsChanged || themLastReadChanged || otherUserStateChanged || newSentMessage) {
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
    let myOldMessages;
    if (prevProps != null) {
      myOldMessages = prevProps.thisChat.messages;
    }
    let newMessageObjects = [];
    const thisChat = this.props.thisChat;
    const lastRead = thisChat.lastRead.them;
    this.state.myIDs.filter(item => {
      const message = thisChat.messages.find( ({ id }) => id === item );
      if (message == null) {
        return false;
      }
      return true;
    }).map(item => {
      const message = thisChat.messages.find( ({ id }) => id === item );
      const messageKey = "id" + item;

      let lr = false;
      let nt = true;
      if (lastRead != null && item == lastRead) {
        const sendingMessagesExist = thisChat.sendingMessages && thisChat.sendingMessages.length > 0;
        const simpleConditions = lastRead != thisChat.messages[thisChat.messages.length - 1].id || sendingMessagesExist;
        if (!this.props.inChat && simpleConditions) {
          lr = true;
        }
      }
      if (this.state.inChat == "no" && this.props.inChat) {
        nt = false;
      }

      let edited = message.edited != null ? message.edited : false;

      let messageObject;
      messageObject = {message: message.message, timestamp: parseDate(message.timestamp), basicTimestamp: parseDate(message.timestamp, "basic"), lastRead: lr, noTransition: nt, id: item, edited: edited};

      newMessageObjects.push(messageObject);
    });

    let newInChat = "no";
    let icnt = true;
    let newICT = false;
    const lastMessageID = thisChat.messages[thisChat.messages.length - 1].id;
    if (newMessageObjects[newMessageObjects.length - 1].id == lastMessageID/* && prevProps.openedDM == this.props.openedDM*/) {
      if (this.props.inChat) {
        newInChat = "here";
      } else if (lastRead == lastMessageID && this.state.myIDs[this.state.myIDs.length - 1] == lastMessageID) {
        newInChat = "gone";
      }

      const oldStateMessages = this.state.messageList;
      if (oldStateMessages != null && oldStateMessages.length > 0 && oldStateMessages[oldStateMessages.length - 1].id == thisChat.messages[thisChat.messages.length - 1].id) {
        if (this.state.inChat == "here" && !this.props.inChat) {
          newInChat = "gone";
          icnt = false;
        }
        if (this.state.inChat == "gone" && newInChat == "here") {
          icnt = false;
        }
        if (this.state.inChat == "no" && newInChat == "here") {
          icnt = false;
        }
      }



      if (newInChat == "here" && this.props.typing) {
        newICT = true;
      }



      if (thisChat.sendingMessages != null && thisChat.sendingMessages.length > 0 && this.state.messageEmail == this.props.myEmail) {
        let currentSendingID = 0;
        thisChat["sendingMessages"].map(item => {
          const messageObject = {message: item, lastRead: false, noTransition: true, sending: true, id: "sending" + currentSendingID, edited: false};
          newMessageObjects.push(messageObject);
          currentSendingID++;
        });
      }
    }



    const message = thisChat.messages.find( ({ id }) => id === this.state.myIDs[0] );
    if (message.from == "me" && this.state.myIDs.includes(thisChat.messages[thisChat.messages.length - 1].id) && thisChat.sendingMessages != null) {
      thisChat.sendingMessages.map(item => {
        console.log(item);
        let messageElement;
        messageElement = <p key={"key" + item} className="defaultMessageText defaultMessageSending">{item}</p>;
        //newMessages.push(messageElement);
      });
    }

    this.setState({messageList: newMessageObjects, inChat: newInChat, inChatNoTransition: icnt, inChatTyping: newICT});
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
          email={this.state.messageEmail}
          name={this.state.messageName}
          picture={this.state.messagePicture}
          messages={this.state.messageList}
          inChat={[this.state.inChat, this.state.inChatNoTransition]}
          inChatTyping={this.state.inChatTyping}
          onUpdate={this.props.onUpdate}
          editing={this.props.editing}
          setMessageEditing={this.props.setMessageEditing}
          openedDM={this.props.openedDM}
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
