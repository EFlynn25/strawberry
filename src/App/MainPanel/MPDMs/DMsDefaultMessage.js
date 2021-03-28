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
    };
  }

  componentDidMount(prevProps) {
    this.reloadData();
  }

  componentDidUpdate(prevProps) {
    const propsOpenedChat = this.props.openedChat;
    if (prevProps.chats[propsOpenedChat].messages != this.props.chats[propsOpenedChat].messages) {
      this.reloadData();
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

    // myChatMessages.map(function(key) {
    //   if (key.id >= myID) {
    //     if (key.id == myID) {
    //       from = key.from;
    //     }
    //
    //     if (key.from != from) {
    //       break;
    //     }
    //
    //     ids.push(key.id);
    //   }
    // });

    console.log(" --- START --- ");
    console.log(myChatMessages);
    console.log("myID: " + myID);
    console.log("firstMessageID: " + firstMessageID);

    for (var i = myID - firstMessageID; true; i++) {
      if (from.length == 0) {
        from = myChatMessages[i].from;
      }
      console.log("i: " + i);
      console.log("current id: " + (i + firstMessageID));
      console.log("current message: ", myChatMessages[i]);
      if (myChatMessages[i + 1] == null || myChatMessages[i].from != from) {
        break;
      }
      ids.push(i + firstMessageID);
    }

    console.log(ids);

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

  render() {
    return (
      <div className="DMsDefaultMessage">




      <img src={this.state.messagePicture} className="defaultMessagePFP" alt={this.state.messageName} />
        <div className="defaultMessageName">
          {this.state.messageName}
          {/*sendingElement*/}
        </div>
        <div className="defaultMessageGroup">
          {/*
            messageIDs.map(item => {
              const message = thisChat["messages"].find( ({ id }) => id === item );
              const messageKey = "id" + item;
              console.debug("messageKey: " + messageKey);
              let lastReadElement;
              // if (!inChat && lastRead != null && item == lastRead && lastRead != thisChat.messages[thisChat.messages.length - 1].id) {
              if (lastRead != null && item == lastRead) {
                let myClasses = "dmsLastRead dmsIndicatorHide";
                if (!inChat && lastRead != thisChat.messages[thisChat.messages.length - 1].id) {
                  myClasses = "dmsLastRead";
                }
                if (myOldMessages != null && myOldMessages[myOldMessages.length - 1].id + 1 == thisChat.messages[thisChat.messages.length - 1].id) {
                  myClasses += " noTransition";
                }
                lastReadElement = <img src={myPerson.picture} className={myClasses} alt={myPerson.name} />;
              }
              let messageElement;
              if ("sending" in message) {
                messageElement = <p key={messageKey} className="defaultMessageText defaultMessageSending">{message.message}</p>;
              } else {
                messageElement = <p key={messageKey} title={this.parseDate(message.timestamp)} className="defaultMessageText">{message.message}{lastReadElement}</p>;
              }

              return messageElement;
            })*/
            this.state.myIDs.map(item => {
              const thisChat = this.props.chats[this.props.openedChat];
              const message = thisChat.messages.find( ({ id }) => id === item );
              const messageKey = "id" + item;

              const lastRead = message.lastRead.them;



              let lastReadElement;
              if (lastRead != null && item == lastRead) {
                let myClasses = "dmsLastRead dmsIndicatorHide";
                if (!this.props.inChat && lastRead != thisChat.messages[thisChat.messages.length - 1].id) {
                  myClasses = "dmsLastRead";
                }
                if (myOldMessages != null && myOldMessages[myOldMessages.length - 1].id + 1 == thisChat.messages[thisChat.messages.length - 1].id) {
                  myClasses += " noTransition";
                }
                lastReadElement = <img src={this.state.messagePicture} className={myClasses} alt={this.state.messageName} />;
              }
              let messageElement;
              if ("sending" in message) {
                messageElement = <p key={messageKey} className="defaultMessageText defaultMessageSending">{message.message}</p>;
              } else {
                messageElement = <p key={messageKey} title={this.parseDate(message.timestamp)} className="defaultMessageText">{message.message}{lastReadElement}</p>;
              }

              return messageElement;







            })
          }
          <p key={/*messageKey*/"no"} title={/*this.parseDate(message.timestamp)*/"no"} className="defaultMessageText">{/*message.message*/"yay"}{/*lastReadElement*/null}</p>
        </div>
        <h1 className="defaultMessageTimestamp">{/*timestampElement*/}4:20 PM</h1>
        <img src={/*myPerson.picture*/null} className={"dmsInChat dmsIndicatorHide"/*inChatClasses*/} alt={/*myPerson.name*/"name lol"} />
        <div className={"dmsInChatTyping dmsInChatTypingHide"/*inChatTypingClasses*/}>
          <div className="dmsInChatTypingDot" style={{left: "15px", animationDelay: ".25s"}}></div>
          <div className="dmsInChatTypingDot" style={{left: "24px", animationDelay: ".5s"}}></div>
          <div className="dmsInChatTypingDot"></div>
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
