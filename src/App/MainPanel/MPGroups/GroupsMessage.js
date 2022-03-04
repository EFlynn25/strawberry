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

import './GroupsMessage.css';
import { getUser } from '../../../GlobalComponents/getUser.js';
import GroupsDefaultMessage from './GroupsMessage/GroupsDefaultMessage';
import GroupsBreckanMessage from './GroupsMessage/GroupsBreckanMessage';

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
    const thisThread = this.props.thisThread;
    const prevCurrentThread = prevProps.thisThread;

    const messagesExist = thisThread.messages != null && thisThread.messages.length > 0;
    // const sentNewMessage = prevCurrentThread.messages != thisThread.messages && prevCurrentThread.messages[prevCurrentThread.messages.length - 1].id == this.state.myIDs[this.state.myIDs.length - 1];
    const chatChanged = !equal(prevCurrentThread.messages, thisThread.messages);
    const openedThreadChanged = prevProps.openedThread != this.props.openedThread;

    const idsChanged = prevState.myIDs != this.state.myIDs;
    const themLastReadChanged = !equal(prevCurrentThread.lastRead, thisThread.lastRead);

    const otherUserStateChanged = prevCurrentThread.inThread != thisThread.inThread || prevCurrentThread.typing != thisThread.typing;
    const newSentMessage = prevCurrentThread.sendingMessages != thisThread.sendingMessages;

    const newKnownPeople = !equal(prevProps.knownPeople, this.props.knownPeople);
    if (messagesExist && (/*sentNewMessage*/ chatChanged || openedThreadChanged || newKnownPeople)) {
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

    const thisThread = this.props.thisThread;
    const thisThreadMessages = thisThread.messages;
    const firstMessageID = thisThreadMessages[0].id;

    let ids = [];
    let from = "";

    if (!Array.isArray(myID)) {
      for (let i = myID - firstMessageID; true; i++) {
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
    let newMessageObjects = [];
    const thisThread = this.props.thisThread;
    const firstMessageID = thisThread.messages[0].id;

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

    this.state.myIDs.forEach(item => {
      const message = thisThread.messages[item - firstMessageID];


      // let lr = false;
      // let nt = false;
      // const sendingMessagesExist = thisChat.sendingMessages && thisChat.sendingMessages.length > 0;
      // if (lastRead != null && item == lastRead) {
      //   const simpleConditions = lastRead != thisChat.messages[thisChat.messages.length - 1].id || sendingMessagesExist;
      //   if (!this.props.inChat && simpleConditions) {
      //     lr = true;
      //   }
      // }
      // if (sendingMessagesExist) {
      //   nt = true;
      // }


      const unrefinedLR = this.myLastRead[message.id];
      let lr = [];
      if (unrefinedLR != null) {
        const simpleConditions = message.id != thisThread.messages[thisThread.messages.length - 1].id || thisThread.sendingMessages && thisThread.sendingMessages.length > 0;
        if (simpleConditions) {
          unrefinedLR.forEach((item, i) => {
            if (!thisThread.inThread.includes(item)) {
              lr.push(item);
            }
          });
        }
      }

      let edited = message.edited != null ? message.edited : false;

      let messageObject;
      messageObject = {
        message: message.message,
        timestamp: message.timestamp,
        lastRead: lr,
        id: item,
        edited: edited
      };

      newMessageObjects.push(messageObject);
    });

    // let newInThread = {};
    // let newTyping = [];
    // const lastMessageID = thisThread.messages[thisThread.messages.length - 1].id;
    // if (newMessageObjects[newMessageObjects.length - 1].id == lastMessageID) {
    //   let myLR = this.myLastRead[lastMessageID];
    //   if (myLR != null) {
    //     myLR.forEach((item, i) => {
    //       if (!thisThread.inThread.includes(item)) {
    //         newInThread[item] = "gone";
    //       }
    //     });
    //   }
    //
    //   thisThread.inThread.forEach((item, i) => {
    //     newInThread[item] = "here";
    //   });
    //
    //   thisThread.typing.forEach((item, i) => {
    //     newTyping.push(item);
    //   });
    // }



    const message = thisThread.messages.find( ({ id }) => id === this.state.myIDs[0] );
    if (message.from == this.props.myEmail && this.state.myIDs.includes(thisThread.messages[thisThread.messages.length - 1].id) && thisThread.sendingMessages != null) {
      thisThread.sendingMessages.forEach((item, i) => {
        const sendingMessageObject = {"message": item, "id": "sending" + i, "sending": true, edited: false};
        newMessageObjects.push(sendingMessageObject);
      });
    }

    this.setState({ messageList: newMessageObjects });
  }

  render() {
    let MessageType;
    if (this.props.messageStyle == "default") {
      MessageType = GroupsDefaultMessage;
    } else if (this.props.messageStyle == "breckan") {
      MessageType = GroupsBreckanMessage;
    }

    return (
      <div className="GroupsMessage">
        <MessageType
          email={this.state.messageEmail}
          name={this.state.messageName}
          picture={this.state.messagePicture}
          messages={this.state.messageList}
          inThread={[this.state.inThread, this.state.inThreadNoTransition]}
          inThreadTyping={this.state.inThreadTyping}
          onUpdate={this.props.onUpdate}
          editing={this.props.editing}
          setMessageEditing={this.props.setMessageEditing}
          openedThread={this.props.openedThread}
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

export default connect(mapStateToProps, null)(GroupsMessage);
