// I hope someone can try to understand this...
// My thought was to have the "...Message.js" files be like a wrapper
// for the "...DefaultMessage.js" files so that I can implement customizable
// messages in the future. The "...DefaultMessage.js" files JUST display what
// "...Message.js" files give them.

import React from 'react';
import { connect } from 'react-redux';

import './GroupsMessage.css';
import { getUser } from '../../../GlobalComponents/getUser.js';
import { parseDate } from '../../../GlobalComponents/parseDate.js';
import GroupsDefaultMessage from './GroupsMessage/GroupsDefaultMessage';

class GroupsMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myIDs: [],
      messageEmail: "",
      messageName: "",
      messagePicture: "",
      messageList: [],
      messageElements: [],
      inThread: {},
      inThreadNoTransition: true,
      inThreadTyping: false,
    };

    this.myLastRead = {};
  }

  componentDidMount() {
    this.reloadData();
  }

  componentDidUpdate(prevProps, prevState) {
    const propsOpenedThread = this.props.openedThread;
    const thisThread = this.props.threads[propsOpenedThread];
    const prevCurrentThread = prevProps.threads[propsOpenedThread];

    const messagesExist = thisThread.messages != null && thisThread.messages.length > 0;
    const sentNewMessage = prevCurrentThread.messages != thisThread.messages && prevCurrentThread.messages[prevCurrentThread.messages.length - 1].id == this.state.myIDs[this.state.myIDs.length - 1];
    const openedThreadChanged = prevProps.openedThread != propsOpenedThread;

    const idsChanged = prevState.myIDs != this.state.myIDs;
    const themLastReadChanged = JSON.stringify(prevCurrentThread.lastRead) != JSON.stringify(thisThread.lastRead);

    const otherUserStateChanged = prevCurrentThread.inThread != thisThread.inThread || prevCurrentThread.typing != thisThread.typing;
    const newSentMessage = prevCurrentThread.sendingMessages != thisThread.sendingMessages;

    const newKnownPeople = JSON.stringify(prevProps.knownPeople) != JSON.stringify(this.props.knownPeople);
    if (messagesExist && (sentNewMessage || openedThreadChanged || newKnownPeople)) {
      this.reloadData();
      this.reloadMessage(prevProps);
    } else {
      if (idsChanged || themLastReadChanged || otherUserStateChanged || newSentMessage) {
        this.reloadMessage(prevProps);
      }
    }
  }

  reloadData() {
    const propsOpenedThread = this.props.openedThread;
    const myID = this.props.id;

    const thisThread = this.props.threads[propsOpenedThread];
    const thisThreadMessages = thisThread.messages;
    const firstMessageID = thisThreadMessages[0].id;

    var ids = [];
    var from = "";

    if (!Array.isArray(myID)) {
      for (var i = myID - firstMessageID; true; i++) {
        if (from.length == 0) {
          from = thisThreadMessages[i].from;
        }

        if (thisThreadMessages[i].from != from) {
          break;
        }
        ids.push(i + firstMessageID);
        if (thisThreadMessages[i + 1] == null) {
          break;
        }
      }
    } else {
      from = thisThreadMessages[myID[0] - firstMessageID].from;
      ids = myID;
    }

    if (from == this.props.myEmail) {
      this.setState({
        myIDs: ids,
        messageEmail: this.props.myEmail,
        messageName: this.props.myName,
        messagePicture: this.props.myPicture,
      });
    } else {
      const myPerson = getUser(from);
      this.setState({
        myIDs: ids,
        messageEmail: from,
        messageName: myPerson.name,
        messagePicture: myPerson.picture,
      });
    }
  }

  reloadMessage(prevProps) {
    let myOldMessages;
    if (prevProps != null) {
      myOldMessages = prevProps.threads[this.props.openedThread].messages;
    }
    let newMessageObjects = [];
    const thisThread = this.props.threads[this.props.openedThread];

    if (thisThread.lastRead != null) {
      this.myLastRead = {};
      Object.keys(thisThread.lastRead).forEach(item => {
        if (item != this.props.myEmail) {
          if (this.myLastRead[thisThread.lastRead[item]] == null) {
            this.myLastRead[thisThread.lastRead[item]] = [];
          }
          if (!this.myLastRead[thisThread.lastRead[item]].includes(item)) {
            this.myLastRead[thisThread.lastRead[item]].push(item);
          }
        }
      });
    }

    this.state.myIDs.filter(item => {
      const message = thisThread.messages.find( ({ id }) => id === item );
      if (message == null) {
        return false;
      }
      return true;
    }).map(item => {
      const message = thisThread.messages.find( ({ id }) => id === item );
      const messageKey = "id" + item;

      const unrefinedLR = this.myLastRead[message.id];
      let lr = [];
      if (unrefinedLR != null) {
        unrefinedLR.forEach((item, i) => {
          if (!thisThread.inThread.includes(item) && message.id != thisThread.messages[thisThread.messages.length - 1].id) {
            lr.push(item);
          }
        });
      }

      let messageObject;
      messageObject = {message: message.message, timestamp: parseDate(message.timestamp), basicTimestamp: parseDate(message.timestamp, "basic"), lastRead: lr, noTransition: /*nt*/null, id: item};

      newMessageObjects.push(messageObject);
    });

    let newInThread = {};
    let newTyping = [];
    const lastMessageID = thisThread.messages[thisThread.messages.length - 1].id;
    console.log(newMessageObjects);
    if (newMessageObjects[newMessageObjects.length - 1].id == lastMessageID) {
      let myLR = this.myLastRead[lastMessageID];
      if (myLR != null) {
        myLR.forEach((item, i) => {
          if (!thisThread.inThread.includes(item)) {
            newInThread[item] = "gone";
          }
        });
      }

      thisThread.inThread.forEach((item, i) => {
        newInThread[item] = "here";
      });

      thisThread.typing.forEach((item, i) => {
        newTyping.push(item);
      });
    }



    const message = thisThread.messages.find( ({ id }) => id === this.state.myIDs[0] );
    if (message.from == this.props.myEmail && this.state.myIDs.includes(thisThread.messages[thisThread.messages.length - 1].id) && thisThread.sendingMessages != null) {
      thisThread.sendingMessages.forEach((item, i) => {
        console.log(item);
        const sendingMessageObject = {"message": item, "id": "sending" + i, "sending": true};
        newMessageObjects.push(sendingMessageObject);
        console.log(message);
      });
    }

    this.setState({messageList: newMessageObjects, inThread: newInThread, inThreadNoTransition: /*itnt*/null, inThreadTyping: newTyping});
  }

  render() {
    let MessageType;
    if (this.props.messageStyle == "default") {
      MessageType = GroupsDefaultMessage; // this needs changed when I port Breckan-style to Groups
    } else if (this.props.messageStyle == "breckan") {
      MessageType = GroupsDefaultMessage; // this needs changed when I port Breckan-style to Groups
    }

    return (
      <div className="GroupsMessage">
        <MessageType email={this.state.messageEmail} name={this.state.messageName} picture={this.state.messagePicture} messages={this.state.messageList} inThread={[this.state.inThread, this.state.inThreadNoTransition]} inThreadTyping={this.state.inThreadTyping} onUpdate={this.props.onUpdate} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  openedThread: state.groups.openedThread,
  threads: state.groups.threads,
  myName: state.app.name,
  myEmail: state.app.email,
  myPicture: state.app.picture,
  knownPeople: state.people.knownPeople,
  messageStyle: state.app.messageStyle
});

export default connect(mapStateToProps, null)(GroupsMessage);
