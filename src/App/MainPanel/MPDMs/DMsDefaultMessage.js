import React from 'react';
import { connect } from 'react-redux';

import './DMsDefaultMessage.css';

class DMsDefaultMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myIDs: [],
      messageEmail: "",
      messageName: "",
      messagePicture: "",
      messageElements: [],
      inChatClasses: "dmsInChat dmsIndicatorHide",
      inChatTypingClasses: "dmsInChatTyping dmsInChatTypingHide"
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
      this.reloadMessages(prevProps);
    } else {
      if (idsChanged || themLastReadChanged || otherUserStateChanged || newSentMessage) {
        this.reloadMessages(prevProps);
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
        messageEmail: this.props.knownPeople[propsOpenedChat].email,
        messageName: this.props.knownPeople[propsOpenedChat].name,
        messagePicture: this.props.knownPeople[propsOpenedChat].picture,
      });
    }
  }

  reloadMessages(prevProps) {
    let myOldMessages;
    if (prevProps != null) {
      myOldMessages = prevProps.chats[this.props.openedChat].messages;
    }
    let newMessages = [];
    const thisChat = this.props.chats[this.props.openedChat];
    this.state.myIDs.filter(item => {
      const message = thisChat.messages.find( ({ id }) => id === item );
      if (message == null) {
        return false;
      }
      return true;
    }).map(item => {
      const message = thisChat.messages.find( ({ id }) => id === item );
      const messageKey = "id" + item;

      const lastRead = thisChat.lastRead.them;



      let lastReadElement;
      if (lastRead != null && item == lastRead) {
        let myClasses = "dmsLastRead dmsIndicatorHide";
        if (!this.props.inChat && lastRead != thisChat.messages[thisChat.messages.length - 1].id) {
          myClasses = "dmsLastRead";
        }
        if (myOldMessages != null && myOldMessages[myOldMessages.length - 1].id + 1 == thisChat.messages[thisChat.messages.length - 1].id) {
          myClasses += " noTransition";
        }
        lastReadElement = <img src={this.props.knownPeople[this.props.openedChat].picture} className={myClasses} alt={this.props.knownPeople[this.props.openedChat].name} />;
      }

      let messageElement;
      messageElement = <p key={messageKey} title={this.parseDate(message.timestamp)} className="defaultMessageText">{message.message}{lastReadElement}</p>;
      // if ("sending" in message) {
      //   messageElement = <p key={messageKey} className="defaultMessageText defaultMessageSending">{message.message}</p>;
      // } else {
      // }

      newMessages.push(messageElement);
    });

    const message = thisChat.messages.find( ({ id }) => id === this.state.myIDs[0] );
    if (message.from == "me" && this.state.myIDs.includes(thisChat.messages[thisChat.messages.length - 1].id) && thisChat.sendingMessages != null) {
      thisChat.sendingMessages.map(item => {
        console.log(item);
        let messageElement;
        messageElement = <p key={"key" + item} className="defaultMessageText defaultMessageSending">{item}</p>;
        newMessages.push(messageElement);
      });
    }

    this.setState({messageElements: newMessages});

    this.reloadIndicators(prevProps);
  }

  reloadIndicators(prevProps) {
    const thisChat = this.props.chats[this.props.openedChat];
    const myIDs = this.state.myIDs;


    const lastRead = thisChat.lastRead.them;
    const inChat = this.props.inChat;
    const typing = this.props.typing;

    let inChatClasses = "dmsInChat dmsIndicatorHide";
    let inChatTypingClasses = "dmsInChatTyping dmsInChatTypingHide";
    if ((myIDs[myIDs.length - 1] == lastRead || inChat) && myIDs[myIDs.length - 1] == thisChat.messages[thisChat.messages.length - 1].id && (!("sending" in thisChat.messages[thisChat.messages.length - 1]) || inChat)) {
      if (inChat) {
        inChatClasses = "dmsInChat";
        if (typing != null && typing == true) {
          inChatTypingClasses = "dmsInChatTyping";
        }
      } else {
        inChatClasses = "dmsInChat dmsInChatGone";
      }
    }

    let noTransition = false;
    let myOldMessages = null;
    if (prevProps != null) {
      myOldMessages = prevProps.chats[this.props.openedChat].messages;
      var sentNewMessage = myOldMessages != null && myOldMessages[myOldMessages.length - 1].id + 1 == thisChat.messages[thisChat.messages.length - 1].id;
      // console.log(thisChat.messages[thisChat.messages.length - 1].id);
      // console.log(myIDs);
      // console.log(thisChat.messages[thisChat.messages.length - 1].id != myIDs[myIDs.length - 1]);
      if (sentNewMessage || this.state.messageElements.length == 0 || thisChat.messages[thisChat.messages.length - 1].id != myIDs[myIDs.length - 1]) {
        noTransition = true;
        inChatTypingClasses += " noTransition";
      }
    }
    if ("sending" in thisChat.messages[thisChat.messages.length - 1]) {
      noTransition = true;
    }
    if (noTransition) {
      inChatClasses += " noTransition";
    }

    this.setState({
      inChatClasses: inChatClasses,
      inChatTypingClasses: inChatTypingClasses
    });
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
    let timestampElement = "";
    if (this.state.messageElements != null && this.state.messageElements.length > 0) {
      timestampElement = this.state.messageElements[this.state.messageElements.length - 1].props.title;
    }

    return (
      <div className="DMsDefaultMessage">


        <img src={this.state.messagePicture} className="defaultMessagePFP" alt={this.state.messageName} />
        <div className="defaultMessageName">
          {this.state.messageName}
          {/*sendingElement*/}
          {console.log(this.state.messageElements[this.state.messageElements.length - 1])}
          {this.state.messageElements.length > 0 && this.state.messageElements[this.state.messageElements.length - 1].props.className.includes("defaultMessageSending") ? <h1 className="defaultMessageSendingText">Sending...</h1> : null}
        </div>
        <div className="defaultMessageGroup">
          {this.state.messageElements}
        </div>
        <h1 className="defaultMessageTimestamp">{timestampElement}</h1>
        <img src={this.props.knownPeople[this.props.openedChat].picture} className={this.state.inChatClasses} alt={this.props.knownPeople[this.props.openedChat].name} />
        <div className={this.state.inChatTypingClasses}>
          <div className="dmsInChatTypingDot"></div>
          <div className="dmsInChatTypingDot" style={{left: "15px", animationDelay: ".25s"}}></div>
          <div className="dmsInChatTypingDot" style={{left: "24px", animationDelay: ".5s"}}></div>
        </div>


      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  openedChat: state.dms.openedChat,
  chats: state.dms.chats,
  myName: state.user.name,
  myEmail: state.user.email,
  myPicture: state.user.picture,
  knownPeople: state.people.knownPeople
});

export default connect(mapStateToProps, null)(DMsDefaultMessage);
