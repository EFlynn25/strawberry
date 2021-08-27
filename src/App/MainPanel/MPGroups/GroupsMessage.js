import React from 'react';
import { connect } from 'react-redux';

import './GroupsMessage.css';
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
      inThread: "no",
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
    const prevCurrentChat = prevProps.threads[propsOpenedThread];

    const messagesExist = thisThread.messages != null && thisThread.messages.length > 0;
    const sentNewMessage = prevCurrentChat.messages != thisThread.messages && prevCurrentChat.messages[prevCurrentChat.messages.length - 1].id == this.state.myIDs[this.state.myIDs.length - 1];
    const openedThreadChanged = prevProps.openedThread != propsOpenedThread;

    const idsChanged = prevState.myIDs != this.state.myIDs;
    const themLastReadChanged = JSON.stringify(prevCurrentChat.lastRead) != JSON.stringify(thisThread.lastRead);

    const otherUserStateChanged = prevProps.inThread != this.props.inThread || prevProps.typing != this.props.typing;
    // const newSentMessage = prevCurrentChat.sendingMessages != null && thisThread.sendingMessages != null && prevCurrentChat.sendingMessages != thisThread.sendingMessages;
    const newSentMessage = prevCurrentChat.sendingMessages != thisThread.sendingMessages;
    if (messagesExist && (sentNewMessage || openedThreadChanged)) {
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

    const thisThread = this.props.threads[propsOpenedThread];
    const thisThreadMessages = thisThread.messages;

    const firstMessageID = thisThreadMessages[0].id;
    const myID = this.props.id;
    var ids = [];
    var from = "";

    for (var i = myID - firstMessageID; true; i++) {
      if (from.length == 0) {
        from = thisThreadMessages[i].from;
      }
      // console.log("i: " + i);
      // console.log("current id: " + (i + firstMessageID));
      // console.log("current message: ", myChatMessages[i]);
      if (thisThreadMessages[i].from != from) {
        break;
      }
      ids.push(i + firstMessageID);
      if (thisThreadMessages[i + 1] == null) {
        break;
      }
    }

    // console.log(ids);

    if (from == this.props.myEmail) {
      this.setState({
        myIDs: ids,
        messageEmail: this.props.myEmail,
        messageName: this.props.myName,
        messagePicture: this.props.myPicture,
      });
    } else {
      this.setState({
        myIDs: ids,
        messageEmail: from,
        messageName: this.props.knownPeople[from].name,
        messagePicture: this.props.knownPeople[from].picture,
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
      console.log(this.myLastRead);
    }

    // const lastRead = thisThread.lastRead.them;
    this.state.myIDs.filter(item => {
      const message = thisThread.messages.find( ({ id }) => id === item );
      if (message == null) {
        return false;
      }
      return true;
    }).map(item => {
      const message = thisThread.messages.find( ({ id }) => id === item );
      const messageKey = "id" + item;

      // let lr = false;
      // let nt = true;
      // if (lastRead != null && item == lastRead) {
      //   if (!this.props.inThread && lastRead != thisThread.messages[thisThread.messages.length - 1].id) {
      //     lr = true;
      //   }
      // }
      // if (this.state.inThread == "no" && this.props.inThread) {
      //   nt = false;
      // }

      let lr = this.myLastRead[message.id];
      // if (message.id == 41) {
      //   lr = ["fireno656@yahoo.com"];
      // } else if (message.id == 42) {
      //   lr = ["fireno656@yahoo.com", "ethan.flynn2007@gmail.com"];
      // } else if (message.id == 43) {
      //   lr = ["fireno656@yahoo.com", "ethan.flynn2007@gmail.com", "asher.molzer@gmail.com"];
      // } else if (message.id == 44) {
      //   lr = ["fireno656@yahoo.com", "ethan.flynn2007@gmail.com", "asher.molzer@gmail.com", "isaiahroman25@gmail.com"];
      // } else if (message.id == 45) {
      //   lr = ["fireno656@yahoo.com", "ethan.flynn2007@gmail.com", "asher.molzer@gmail.com", "isaiahroman25@gmail.com", "appleandroidtechmaker@gmail.com"];
      // } else if (message.id == 46) {
      //   lr = ["fireno656@yahoo.com", "ethan.flynn2007@gmail.com", "asher.molzer@gmail.com", "isaiahroman25@gmail.com", "appleandroidtechmaker@gmail.com", "katrinaflynn79@gmail.com"];
      // } else if (message.id == 47) {
      //   lr = ["fireno656@yahoo.com", "ethan.flynn2007@gmail.com", "asher.molzer@gmail.com", "isaiahroman25@gmail.com", "appleandroidtechmaker@gmail.com", "katrinaflynn79@gmail.com", "flynneverett@logoscharter.com"];
      // } else if (message.id == 48) {
      //   lr = ["fireno656@yahoo.com", "ethan.flynn2007@gmail.com", "asher.molzer@gmail.com", "isaiahroman25@gmail.com", "appleandroidtechmaker@gmail.com", "katrinaflynn79@gmail.com", "flynneverett@logoscharter.com", "cherryman656@gmail.com"];
      // }

      let messageObject;
      messageObject = {message: message.message, timestamp: this.parseDate(message.timestamp), lastRead: lr, noTransition: /*nt*/null, id: item};

      newMessageObjects.push(messageObject);
    });

    // let newInThread = "no";
    // let icnt = true;
    // let newICT = false;
    // const lastMessageID = thisThread.messages[thisThread.messages.length - 1].id;
    // if (newMessageObjects[newMessageObjects.length - 1].id == lastMessageID/* && prevProps.openedThread == this.props.openedThread*/) {
    //   if (this.props.inThread) {
    //     newInThread = "here";
    //   } else if (lastRead == lastMessageID && this.state.myIDs[this.state.myIDs.length - 1] == lastMessageID) {
    //     newInThread = "gone";
    //   }
    //
    //   const oldStateMessages = this.state.messageList;
    //   if (oldStateMessages != null && oldStateMessages.length > 0 && oldStateMessages[oldStateMessages.length - 1].id == thisThread.messages[thisThread.messages.length - 1].id) {
    //   // if (lastMessageID == newMessageObjects[newMessageObjects.length - 1].id) {
    //     if (this.state.inThread == "here" && !this.props.inThread) {
    //       newInThread = "gone";
    //       icnt = false;
    //     }
    //     if (this.state.inThread == "gone" && newInThread == "here") {
    //       icnt = false;
    //     }
    //     // console.log(prevProps.openedThread);
    //     // console.log(this.props.openedThread);
    //     if (this.state.inThread == "no" && newInThread == "here" /*&& lastRead < lastMessageID*/) {
    //       icnt = false;
    //     }
    //   }
    //
    //
    //
    //   if (newInThread == "here" && this.props.typing) {
    //     newICT = true;
    //   }
    //
    //
    //
    //   if (thisThread.sendingMessages != null && thisThread.sendingMessages.length > 0 && this.state.messageEmail == this.props.myEmail) {
    //     var currentSendingID = 0;
    //     thisThread["sendingMessages"].map(item => {
    //       const messageObject = {message: item, lastRead: false, noTransition: true, sending: true, id: "sending" + currentSendingID};
    //       newMessageObjects.push(messageObject);
    //       currentSendingID++;
    //     });
    //   }
    // }



    const message = thisThread.messages.find( ({ id }) => id === this.state.myIDs[0] );
    if (message.from == this.props.myEmail && this.state.myIDs.includes(thisThread.messages[thisThread.messages.length - 1].id) && thisThread.sendingMessages != null) {
      thisThread.sendingMessages.forEach((item, i) => {
        console.log(item);
        // let messageElement = (<p key={"key" + item} className="defaultMessageText defaultMessageSending">{item}</p>);
        const sendingMessageObject = {"message": item, "id": "sending" + i, "sending": true};
        newMessageObjects.push(sendingMessageObject);
        console.log(message);
      });
    }

    this.setState({messageList: newMessageObjects, inThread: /*newInThread*/null, inThreadNoTransition: /*icnt*/null, inThreadTyping: /*newICT*/null});
  }

  parseDate(timestamp) {
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(timestamp * 1000);

    let month = shortMonths[date.getMonth()];
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const fullString = month + ' ' + date.getDate() + ', ' + date.getFullYear() + ' • ' + hours + ':' + minutes + ' ' + ampm;

    return(fullString);
  }

  render() {
    let MessageType;
    if (this.props.messageStyle == "default") {
      MessageType = GroupsDefaultMessage;
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
