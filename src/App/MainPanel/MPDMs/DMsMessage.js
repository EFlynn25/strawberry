import React from 'react';
import { connect } from 'react-redux';

import './DMsMessage.css';
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
    };
  }

  componentDidMount() {
    this.reloadData();
  }

  componentDidUpdate(prevProps, prevState) {
    const propsOpenedChat = this.props.openedChat;
    const thisChat = this.props.chats[propsOpenedChat];
    const prevCurrentChat = prevProps.chats[propsOpenedChat];

    const messagesExist = thisChat.messages != null && thisChat.messages.length > 0;
    const sentNewMessage = prevCurrentChat.messages != thisChat.messages && prevCurrentChat.messages[prevCurrentChat.messages.length - 1].id == this.state.myIDs[this.state.myIDs.length - 1];
    const openedChatChanged = prevProps.openedChat != propsOpenedChat;

    const idsChanged = prevState.myIDs != this.state.myIDs;
    const themLastReadChanged = prevCurrentChat.lastRead.them != thisChat.lastRead.them;
    const otherUserStateChanged = prevProps.inChat != this.props.inChat || prevProps.typing != this.props.typing;
    // const newSentMessage = prevCurrentChat.sendingMessages != null && thisChat.sendingMessages != null && prevCurrentChat.sendingMessages != thisChat.sendingMessages;
    const newSentMessage = prevCurrentChat.sendingMessages != thisChat.sendingMessages;
    if (messagesExist && (sentNewMessage || openedChatChanged)) {
      this.reloadData();
      this.reloadMessage(prevProps);
    } else {
      if (idsChanged || themLastReadChanged || otherUserStateChanged || newSentMessage) {
        this.reloadMessage(prevProps);
      }
    }
  }

  reloadData() {
    const propsOpenedChat = this.props.openedChat;

    const myChat = this.props.chats[propsOpenedChat];
    const myChatMessages = this.props.chats[propsOpenedChat].messages;

    const firstMessageID = myChatMessages[0].id;
    const myID = this.props.id;
    var ids = [];
    var from = "";

    for (var i = myID - firstMessageID; true; i++) {
      if (from.length == 0) {
        from = myChatMessages[i].from;
      }
      // console.log("i: " + i);
      // console.log("current id: " + (i + firstMessageID));
      // console.log("current message: ", myChatMessages[i]);
      if (myChatMessages[i].from != from) {
        break;
      }
      ids.push(i + firstMessageID);
      if (myChatMessages[i + 1] == null) {
        break;
      }
    }

    // console.log(ids);

    if (from == "me") {
      this.setState({
        myIDs: ids,
        messageEmail: this.props.myEmail,
        messageName: this.props.myName,
        messagePicture: this.props.myPicture,
      });
    } else if (from == "them") {
      this.setState({
        myIDs: ids,
        messageEmail: propsOpenedChat,
        messageName: this.props.knownPeople[propsOpenedChat].name,
        messagePicture: this.props.knownPeople[propsOpenedChat].picture,
      });
    }
  }

  reloadMessage(prevProps) {
    let myOldMessages;
    if (prevProps != null) {
      myOldMessages = prevProps.chats[this.props.openedChat].messages;
    }
    let newMessageObjects = [];
    const thisChat = this.props.chats[this.props.openedChat];
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
    const lastMessageID = thisChat.messages[thisChat.messages.length - 1].id;
    if (this.props.inChat) {
      newInChat = "here";
    } else if (lastRead == lastMessageID && this.state.myIDs[this.state.myIDs.length - 1] == lastMessageID) {
      newInChat = "gone";
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

    this.setState({messageList: newMessageObjects, inChat: newInChat});
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
        <MessageType email={this.state.messageEmail} name={this.state.messageName} picture={this.state.messagePicture} messages={this.state.messageList} inChat={[this.state.inChat, this.state.inChatNoTransition]} onUpdate={this.props.onUpdate} />
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
        <img src={this.props.knownPeople[this.props.openedChat].picture} className={this.state.inChatClasses} alt={this.props.knownPeople[this.props.openedChat].name} style={this.state.messageElements.length > 0 && this.state.messageElements[this.state.messageElements.length - 1].props.className.includes("defaultMessageSending") ? {bottom: "-15px"} : null} />
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
  openedChat: state.dms.openedChat,
  chats: state.dms.chats,
  myName: state.user.name,
  myEmail: state.user.email,
  myPicture: state.user.picture,
  knownPeople: state.people.knownPeople,
  messageStyle: state.user.messageStyle
});

export default connect(mapStateToProps, null)(DMsMessage);
