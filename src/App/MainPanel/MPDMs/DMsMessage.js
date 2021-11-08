import React from 'react';
import { connect } from 'react-redux';

import './DMsMessage.css';
import { getUser } from '../../../GlobalComponents/getUser.js';
import DMsDefaultMessage from './DMsMessage/DMsDefaultMessage';

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
    const propsOpenedDM = this.props.openedDM;
    const thisChat = this.props.chats[propsOpenedDM];
    const prevCurrentChat = prevProps.chats[propsOpenedDM];

    const messagesExist = thisChat.messages != null && thisChat.messages.length > 0;
    const sentNewMessage = prevCurrentChat.messages != thisChat.messages && prevCurrentChat.messages[prevCurrentChat.messages.length - 1].id == this.state.myIDs[this.state.myIDs.length - 1];
    const openedDMChanged = prevProps.openedDM != propsOpenedDM;

    const idsChanged = prevState.myIDs != this.state.myIDs;
    const themLastReadChanged = prevCurrentChat.lastRead.them != thisChat.lastRead.them;
    const otherUserStateChanged = prevProps.inChat != this.props.inChat || prevProps.typing != this.props.typing;
    // const newSentMessage = prevCurrentChat.sendingMessages != null && thisChat.sendingMessages != null && prevCurrentChat.sendingMessages != thisChat.sendingMessages;
    const newSentMessage = prevCurrentChat.sendingMessages != thisChat.sendingMessages;
    if (messagesExist && (sentNewMessage || openedDMChanged)) {
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

    const myChat = this.props.chats[propsOpenedDM];
    const myChatMessages = myChat.messages;
    const firstMessageID = myChatMessages[0].id;

    var ids = [];
    var from = "";

    if (!Array.isArray(myID)) {
      for (var i = myID - firstMessageID; true; i++) {
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
        // messageName: this.props.knownPeople[propsOpenedDM].name,
        // messagePicture: this.props.knownPeople[propsOpenedDM].picture,
        messageName: thisUser.name,
        messagePicture: thisUser.picture,
      });
    }
  }

  reloadMessage(prevProps) {
    let myOldMessages;
    if (prevProps != null) {
      myOldMessages = prevProps.chats[this.props.openedDM].messages;
    }
    let newMessageObjects = [];
    const thisChat = this.props.chats[this.props.openedDM];
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
        if (!this.props.inChat && lastRead != thisChat.messages[thisChat.messages.length - 1].id) {
          lr = true;
        }
      }
      if (this.state.inChat == "no" && this.props.inChat) {
        nt = false;
      }

      let messageObject;
      messageObject = {message: message.message, timestamp: this.parseDate(message.timestamp), lastRead: lr, noTransition: nt, id: item};

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
      // if (lastMessageID == newMessageObjects[newMessageObjects.length - 1].id) {
        if (this.state.inChat == "here" && !this.props.inChat) {
          newInChat = "gone";
          icnt = false;
        }
        if (this.state.inChat == "gone" && newInChat == "here") {
          icnt = false;
        }
        // console.log(prevProps.openedDM);
        // console.log(this.props.openedDM);
        if (this.state.inChat == "no" && newInChat == "here" /*&& lastRead < lastMessageID*/) {
          icnt = false;
        }
      }



      if (newInChat == "here" && this.props.typing) {
        newICT = true;
      }



      if (thisChat.sendingMessages != null && thisChat.sendingMessages.length > 0 && this.state.messageEmail == this.props.myEmail) {
        var currentSendingID = 0;
        thisChat["sendingMessages"].map(item => {
          const messageObject = {message: item, lastRead: false, noTransition: true, sending: true, id: "sending" + currentSendingID};
          newMessageObjects.push(messageObject);
          currentSendingID++;
        });
      }
    }


    // console.log("start in chat test");
    // console.log("lastMessageID: " + lastMessageID);
    // console.log("lastRead: " + lastRead);
    // console.log("last of myIDs: " + this.state.myIDs[this.state.myIDs.length - 1]);
    // const wasHere = this.state.inChat == "here";
    // const noNewMessage = myOldMessages != null && myOldMessages.length > 0 && myOldMessages[myOldMessages.length - 1].id == thisChat.messages[thisChat.messages.length - 1].id;
    // const wasHereNoNewMessage = wasHere && noNewMessage;
    // if (this.props.inChat) {
    //   newInChat = "here";
    // } else if (wasHereNoNewMessage || (lastRead == lastMessageID && this.state.myIDs[this.state.myIDs.length - 1] == lastMessageID)) {
    //   newInChat = "gone";
    // }
    // const wasLastRead = this.state.inChat == "no" && this.props.inChat;
    // const wasGoneNowHere = this.state.inChat == "gone" && newInChat == "here";
    // console.log("was: " + this.state.inChat);
    // console.log("now: " + newInChat);
    // console.log("messages the same?: " + noNewMessage);
    // if ((wasLastRead || wasGoneNowHere || wasHere) && noNewMessage) {
    //   icnt = false;
    // }



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
    // let timestampElement = "";
    // if (this.state.messageElements != null && this.state.messageElements.length > 0) {
    //   timestampElement = this.state.messageElements[this.state.messageElements.length - 1].props.title;
    // }

    let MessageType;
    if (this.props.messageStyle == "default") {
      MessageType = DMsDefaultMessage;
    }

    return (
      <div className="DMsMessage">
        <MessageType email={this.state.messageEmail} name={this.state.messageName} picture={this.state.messagePicture} messages={this.state.messageList} inChat={[this.state.inChat, this.state.inChatNoTransition]} inChatTyping={this.state.inChatTyping} onUpdate={this.props.onUpdate} />
      </div>
    );

    /*
    return (
      <div className="DMsMessage">


        <img src={this.state.messagePicture} className="defaultMessagePFP" alt={this.state.messageName} />
        <div className="defaultMessageName">
          {this.state.messageName}
          {/*sendingElement*}
          {this.state.messageElements.length > 0 && this.state.messageElements[this.state.messageElements.length - 1].props.className.includes("defaultMessageSending") ? <h1 className="defaultMessageSendingText">Sending...</h1> : null}
        </div>
        <div className="defaultMessageGroup">
          {this.state.messageElements}
        </div>
        <h1 className="defaultMessageTimestamp">{timestampElement}</h1>
        <img src={this.props.knownPeople[this.props.openedDM].picture} className={this.state.inChatClasses} alt={this.props.knownPeople[this.props.openedDM].name} style={this.state.messageElements.length > 0 && this.state.messageElements[this.state.messageElements.length - 1].props.className.includes("defaultMessageSending") ? {bottom: "-15px"} : null} />
        <div style={this.state.messageElements.length > 0 && this.state.messageElements[this.state.messageElements.length - 1].props.className.includes("defaultMessageSending") ? {bottom: "-15px"} : null} className={this.state.inChatTypingClasses}>
          <div className="dmsInChatTypingDot"></div>
          <div className="dmsInChatTypingDot" style={{left: "15px", animationDelay: ".25s"}}></div>
          <div className="dmsInChatTypingDot" style={{left: "24px", animationDelay: ".5s"}}></div>
        </div>


      </div>
    );
    */
  }
}

const mapStateToProps = (state) => ({
  openedDM: state.dms.openedDM,
  chats: state.dms.chats,
  myName: state.app.name,
  myEmail: state.app.email,
  myPicture: state.app.picture,
  knownPeople: state.people.knownPeople,
  messageStyle: state.app.messageStyle
});

export default connect(mapStateToProps, null)(DMsMessage);
