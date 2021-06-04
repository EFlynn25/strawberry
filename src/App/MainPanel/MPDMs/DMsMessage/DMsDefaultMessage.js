import React from 'react';
import { connect } from 'react-redux';

import './DMsDefaultMessage.css';

class DMsDefaultMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    if (this.props.onUpdate != null) {
      this.props.onUpdate();
    }
  }

  // reloadMessages(prevProps) {
  //   let myOldMessages;
  //   if (prevProps != null) {
  //     myOldMessages = prevProps.chats[this.props.openedChat].messages;
  //   }
  //   let newMessages = [];
  //   const thisChat = this.props.chats[this.props.openedChat];
  //   this.state.myIDs.filter(item => {
  //     const message = thisChat.messages.find( ({ id }) => id === item );
  //     if (message == null) {
  //       return false;
  //     }
  //     return true;
  //   }).map(item => {
  //     const message = thisChat.messages.find( ({ id }) => id === item );
  //     const messageKey = "id" + item;
  //
  //     const lastRead = thisChat.lastRead.them;
  //
  //
  //
  //     let lastReadElement;
  //     if (lastRead != null && item == lastRead) {
  //       let myClasses = "dmsLastRead dmsIndicatorHide";
  //       if (!this.props.inChat && lastRead != thisChat.messages[thisChat.messages.length - 1].id) {
  //         myClasses = "dmsLastRead";
  //       }
  //       if (prevProps.openedChat != this.props.openedChat || (myOldMessages != null && myOldMessages[myOldMessages.length - 1].id + 1 == thisChat.messages[thisChat.messages.length - 1].id)) {
  //         myClasses += " noTransition";
  //       }
  //       lastReadElement = <img src={this.props.knownPeople[this.props.openedChat].picture} className={myClasses} alt={this.props.knownPeople[this.props.openedChat].name} />;
  //     }
  //
  //     let messageElement;
  //     messageElement = <p key={messageKey} title={this.parseDate(message.timestamp)} className="defaultMessageText">{message.message}{lastReadElement}</p>;
  //     // if ("sending" in message) {
  //     //   messageElement = <p key={messageKey} className="defaultMessageText defaultMessageSending">{message.message}</p>;
  //     // } else {
  //     // }
  //
  //     newMessages.push(messageElement);
  //   });
  //
  //   const message = thisChat.messages.find( ({ id }) => id === this.state.myIDs[0] );
  //   if (message.from == "me" && this.state.myIDs.includes(thisChat.messages[thisChat.messages.length - 1].id) && thisChat.sendingMessages != null) {
  //     thisChat.sendingMessages.map(item => {
  //       console.log(item);
  //       let messageElement;
  //       messageElement = <p key={"key" + item} className="defaultMessageText defaultMessageSending">{item}</p>;
  //       newMessages.push(messageElement);
  //     });
  //   }
  //
  //   this.setState({messageElements: newMessages});
  //
  //   this.reloadIndicators(prevProps);
  // }
  //
  // reloadIndicators(prevProps) {
  //   const thisChat = this.props.chats[this.props.openedChat];
  //   const myIDs = this.state.myIDs;
  //
  //
  //   const lastRead = thisChat.lastRead.them;
  //   const inChat = this.props.inChat;
  //   const typing = this.props.typing;
  //
  //   let inChatClasses = "dmsInChat dmsIndicatorHide";
  //   let inChatTypingClasses = "dmsInChatTyping dmsInChatTypingHide";
  //   if ((myIDs[myIDs.length - 1] == lastRead || inChat) && myIDs[myIDs.length - 1] == thisChat.messages[thisChat.messages.length - 1].id && (!("sending" in thisChat.messages[thisChat.messages.length - 1]) || inChat)) {
  //     if (inChat) {
  //       inChatClasses = "dmsInChat";
  //       if (typing != null && typing == true) {
  //         inChatTypingClasses = "dmsInChatTyping";
  //       }
  //     } else {
  //       inChatClasses = "dmsInChat dmsInChatGone";
  //     }
  //   }
  //
  //   let noTransition = false;
  //   let myOldMessages = null;
  //   if (prevProps != null) {
  //     myOldMessages = prevProps.chats[this.props.openedChat].messages;
  //     var sentNewMessage = myOldMessages != null && myOldMessages[myOldMessages.length - 1].id + 1 == thisChat.messages[thisChat.messages.length - 1].id;
  //     // console.log(thisChat.messages[thisChat.messages.length - 1].id);
  //     // console.log(myIDs);
  //     // console.log(thisChat.messages[thisChat.messages.length - 1].id != myIDs[myIDs.length - 1]);
  //     if (sentNewMessage || this.state.messageElements.length == 0 || thisChat.messages[thisChat.messages.length - 1].id != myIDs[myIDs.length - 1]) {
  //       noTransition = true;
  //       inChatTypingClasses += " noTransition";
  //     }
  //   }
  //   if ("sending" in thisChat.messages[thisChat.messages.length - 1]) {
  //     noTransition = true;
  //   }
  //   if (noTransition) {
  //     inChatClasses += " noTransition";
  //   }
  //
  //   this.setState({
  //     inChatClasses: inChatClasses,
  //     inChatTypingClasses: inChatTypingClasses
  //   });
  // }

  render() {
    const thisChat = this.props.chats[this.props.openedChat];

    let inChatClasses = "defaultInChat defaultIndicatorHide";
    if (this.props.messages != null && this.props.messages.length > 0 && thisChat.messages[thisChat.messages.length - 1].id == this.props.messages[this.props.messages.length - 1].id) {
      let nt = true;
      if (this.props.inChat[0] == "here") {
        inChatClasses = "defaultInChat";
      } else if (this.props.inChat[0] == "gone") {
        inChatClasses = "defaultInChat defaultInChatGone";
      }
      if (nt) {
        inChatClasses += " noTransition";
      }
    }

    return (
      <div className="DMsDefaultMessage">


        <img src={this.props.picture} className="defaultMessagePFP" alt={this.props.name} />
        <div className="defaultMessageName">
          {this.props.name}
          {this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? <h1 className="defaultMessageSendingText">Sending...</h1> : null}
        </div>
        <div className="defaultMessageGroup">
          {/*this.props.messages*/}
          { this.props.messages == null ? null :
            this.props.messages.map(item => {
              let lrClasses = "defaultLastRead defaultIndicatorHide"
              if (item.lastRead) {
                lrClasses = "defaultLastRead";
              }
              if (item.noTransition) {
                lrClasses += " noTransition";
              }
              const lastReadElement = <img src={this.props.knownPeople[this.props.openedChat].picture} className={lrClasses} alt={this.props.knownPeople[this.props.openedChat].name} />;
              return (<p key={"id" + item.id} title={item.timestamp} className="defaultMessageText">{item.message}{lastReadElement}</p>);
            })
          }
        </div>
        <h1 className="defaultMessageTimestamp">{this.props.messages == null || this.props.messages.length == 0 ? "" : this.props.messages[this.props.messages.length - 1].timestamp/*"time lol"*/}</h1>
        <img src={this.props.knownPeople[this.props.openedChat].picture} className={inChatClasses} alt={this.props.knownPeople[this.props.openedChat].name} style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : null} />
        <div style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : null} className={/*this.state.inChatTypingClasses*/"defaultInChatTyping defaultInChatTypingHide"}>
          <div className="defaultInChatTypingDot"></div>
          <div className="defaultInChatTypingDot" style={{left: "15px", animationDelay: ".25s"}}></div>
          <div className="defaultInChatTypingDot" style={{left: "24px", animationDelay: ".5s"}}></div>
        </div>


      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  openedChat: state.dms.openedChat,
  chats: state.dms.chats,
  knownPeople: state.people.knownPeople
});

export default connect(mapStateToProps, null)(DMsDefaultMessage);
