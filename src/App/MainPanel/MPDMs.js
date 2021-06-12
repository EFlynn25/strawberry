import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';

import './MPDMs.css';
import {
  setopenedChat,
  // addMessage,
  addSendingMessage,
  setTempMessageInput,
  setLastRead
} from '../../redux/dmsReducer';
import {
  setCurrentPage
} from '../../redux/appReducer';
import ethan from "../../assets/images/ethan.webp"
import {
  dms_send_message,
  dms_in_chat,
  dms_typing,
  dms_last_read
} from '../../socket.js';
import DMsMessage from './MPDMs/DMsMessage';
import DMsDefaultMessage from './MPDMs/DMsMessage/DMsDefaultMessage';

// console.debug = function() {}

class MPDMs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      messages: [],
      loaded: false
    };

    this.messagesRef = React.createRef();
    this.inputRef = React.createRef();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.inputEnterPressed = this.inputEnterPressed.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);

    this.shouldScroll = true;
    this.scrollsToIgnore = 0;
  }

  handleScroll() {
    let logtext = "scrolling!! " + this.scrollsToIgnore;
    if (this.scrollsToIgnore > 0) {
      this.scrollsToIgnore--;
    } else {
      if (this.messagesRef.current.scrollTop >= this.messagesRef.current.scrollHeight - this.messagesRef.current.clientHeight - 20) {
        this.shouldScroll = true;
      } else {
        this.shouldScroll = false;
      }
    }
    console.log(logtext + " | shouldScroll " + this.shouldScroll);
  }

  scrollToBottom() {
    if (this.shouldScroll && this.messagesRef.current != null) {
      if (this.messagesRef.current.scrollTop != this.messagesRef.current.scrollHeight - this.messagesRef.current.clientHeight) {
        this.scrollsToIgnore++;
      }
      this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight - this.messagesRef.current.clientHeight;
    }
  }



  componentDidMount() {
    this.props.setopenedChat(this.props.match.params.chatEmail);

    console.log("[MPDMs]: componentDidMount with thread ID " + this.props.openedChat);
    //this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
    // this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight - this.messagesRef.current.clientHeight;

    const propsOpenedChat = this.props.openedChat;
    if (propsOpenedChat in this.props.chats) {
      this.reloadMessages(null);
      dms_in_chat(propsOpenedChat, true);
      dms_in_chat(propsOpenedChat, "get_in_chat");
      dms_typing(propsOpenedChat, "get_typing");
      dms_last_read(propsOpenedChat);

      const tmi = this.props.chats[propsOpenedChat].tempMessageInput;
      console.log(tmi);
      if (tmi != "") {
        this.setState({
          inputValue: tmi
        });
      }

      if (tmi == "" || tmi == null) {
        dms_typing(propsOpenedChat, false);
      }

      if (this.messagesRef.current != null) {
        this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
      }
    }

    let title = "404";
    if (this.props.openedChat in this.props.chats && this.props.openedChat in this.props.getknownPeople) {
      title = this.props.getknownPeople[this.props.openedChat].name;
    }

    this.props.setCurrentPage(title);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("[MPDMs]: componentDidUpdate with thread ID " + this.props.openedChat);

    const propsOpenedChat = this.props.openedChat;

    if (prevState.loaded != this.state.loaded) {
      // this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight - this.messagesRef.current.clientHeight;
    }

    // this.scrollToBottom();

    if (prevProps.openedChat == propsOpenedChat) {
      if (prevProps.chats[propsOpenedChat] != this.props.chats[propsOpenedChat]) {
        this.reloadMessages(prevProps);
      }
    } else {
      this.setState({inputValue: '', loaded: false});
      if (propsOpenedChat in this.props.chats) {
        this.reloadMessages(prevProps);
        if (prevProps.openedChat in this.props.chats) {
          dms_in_chat(prevProps.openedChat, false);
          dms_typing(this.props.openedChat, false);
        }
        dms_in_chat(propsOpenedChat, true);
        dms_in_chat(propsOpenedChat, "get_in_chat");
        dms_typing(propsOpenedChat, "get_typing");
        dms_last_read(propsOpenedChat);
      }
    }

    if (!(propsOpenedChat in prevProps.chats) && propsOpenedChat in this.props.chats) {
      dms_in_chat(propsOpenedChat, true);
      dms_in_chat(propsOpenedChat, "get_in_chat");
      dms_typing(propsOpenedChat, "get_typing");
      dms_last_read(propsOpenedChat);
    }

    const thisChat = this.props.chats[propsOpenedChat];
    if (thisChat != null) {
      const iv = this.state.inputValue
      const tmi = thisChat.tempMessageInput
      if (this.props.openedChat != "" && prevProps.openedChat != propsOpenedChat) {
        if (prevProps.openedChat in this.props.chats) {
          this.props.setTempMessageInput({
            chat: prevProps.openedChat,
            input: iv
          });
        }

        if (tmi != null) {
          this.setState({
            inputValue: tmi
          }, () => {
            this.inputRef.current.select();
          });
        }

        if (tmi == "" || tmi == null) {
          dms_typing(propsOpenedChat, false);
        }
      }
    }

    if (this.state.loaded && prevProps.currentPage != this.props.currentPage && propsOpenedChat in this.props.chats) {
      this.inputRef.current.focus();
    }

    let title = "404";
    if (this.props.openedChat in this.props.chats && this.props.openedChat in this.props.getknownPeople) {
      title = this.props.getknownPeople[this.props.openedChat].name;
    }

    this.props.setCurrentPage(title);
  }

  componentWillUnmount() {
    const iv = this.state.inputValue
    if (this.props.openedChat in this.props.chats) {
      this.props.setTempMessageInput({
        chat: this.props.openedChat,
        input: iv
      });
      dms_in_chat(this.props.openedChat, false);
    }
  }

  reloadMessages(prevProps) {
    if (!(this.props.openedChat in this.props.chats)) {
      this.setState({
        messages: []
      });
      return false;
    }

    const thisChatReference = this.props.chats[this.props.openedChat];
    const thisChat = JSON.parse(JSON.stringify(thisChatReference));

    if (thisChat == null || thisChat["messages"] == null || thisChat["messages"].length <= 0) {
      this.setState({
        messages: [],
        loaded: true
      });
      return false;
    }

    let hasSending = false;
    let handledSending = false;

    if ("sendingMessages" in thisChat && thisChat["sendingMessages"].length > 0) {
      hasSending = true;
      let myID = thisChat.messages[thisChat.messages.length - 1].id + 1;
      thisChat["sendingMessages"].map(item => {
        const myMessage = {message: item, sending: true, id: myID};
        thisChat["messages"].push(myMessage);
        myID++;
      });
    }

    let lastRead;
    if (thisChat.inChat != null) {
      lastRead = thisChat.lastRead.them;
    }

    let inChat = false;
    if (thisChat.inChat != null) {
      inChat = thisChat.inChat;
      if (prevProps != null && this.props.openedChat in prevProps.chats && prevProps.chats[this.props.openedChat].inChat != null && prevProps.chats[this.props.openedChat].inChat && !inChat) {
        lastRead = thisChat["messages"][thisChat["messages"].length - 1].id;
      }
    }

    let nextID = thisChat["messages"][0]["id"];
    let tempMessages = [];
    thisChat["messages"].map((message, i) => {
      console.debug(message);

      if (message["id"] >= nextID && !("sending" in message)) {
        let messageIDs = [message["id"]];
        const messageFrom = message["from"];
        console.debug("before while");
        while (true) {
          const localNextID = messageIDs[messageIDs.length - 1] + 1;
          const findNextID = thisChat["messages"].find( ({ id }) => id === localNextID );

          console.debug("findNextID: " + JSON.stringify(findNextID));
          // console.debug(findNextID);

          if (findNextID == null) {
            console.debug("breaking, due to null");
            break;
          }

          if ("sending" in findNextID && messageFrom == "me") {
            console.log("HANDLED SENDING");
            handledSending = true;
          }

          if (findNextID["from"] == messageFrom || handledSending) {
            messageIDs.push(localNextID);
            nextID = localNextID + 1;
          } else {
            console.debug("breaking, due to new sender");
            break;
          }
        }
        console.debug("after while... " + messageIDs);

        // const myPerson = this.props.getknownPeople[this.props.openedChat];
        // let newMessageName = "";
        // let newMessagePicture = "";
        // if (myPerson != null) {
        //   newMessageName = messageFrom == "me" ? this.props.myName : myPerson.name;
        //   newMessagePicture = messageFrom == "me" ? this.props.myPicture : myPerson.picture;
        // }
        //
        // const lastMessage = thisChat.messages[thisChat.messages.length - 1];
        // let sendingElement;
        // if (lastMessage.id == messageIDs[messageIDs.length - 1] && "sending" in lastMessage) {
        //   sendingElement = <h1 className="defaultMessageSendingText">Sending...</h1>;
        // }
        //
        // const lastID = messageIDs[messageIDs.length - 1];
        // const lastReadyMessage = thisChat["messages"].find( ({ id }) => id === lastID );
        // let timestampElement;
        // if (!("sending" in lastReadyMessage)) {
        //   timestampElement = this.parseDate(lastReadyMessage.timestamp);
        // }
        //
        // let inChatClasses = "dmsInChat dmsIndicatorHide";
        // let inChatTypingClasses = "dmsInChatTyping dmsInChatTypingHide";
        // if ((messageIDs[messageIDs.length - 1] == lastRead || inChat) && messageIDs[messageIDs.length - 1] == thisChat.messages[thisChat.messages.length - 1].id && (!("sending" in thisChat.messages[thisChat.messages.length - 1]) || inChat)) {
        //   if (inChat) {
        //     inChatClasses = "dmsInChat";
        //     if (thisChat.typing != null && thisChat.typing == true) {
        //       inChatTypingClasses = "dmsInChatTyping";
        //     }
        //   } else {
        //     inChatClasses = "dmsInChat dmsInChatGone";
        //   }
        // }
        //
        // let noTransition = false;
        // let myOldMessages = null;
        // if (prevProps != null) {
        //   myOldMessages = prevProps.chats[this.props.openedChat].messages;
        //   var firstCondition = myOldMessages != null && myOldMessages[myOldMessages.length - 1].id + 1 == thisChat.messages[thisChat.messages.length - 1].id;
        //   if (firstCondition || prevProps.openedChat != this.props.openedChat) {
        //     noTransition = true;
        //     inChatTypingClasses += " noTransition";
        //   }
        // }
        // if ("sending" in thisChat.messages[thisChat.messages.length - 1]) {
        //   noTransition = true;
        // }
        // if (noTransition) {
        //   inChatClasses += " noTransition";
        // }
        // const oldMessage = (
        //   <div className="defaultMessage" key={"group" + i}>
        //     <img src={newMessagePicture} className="defaultMessagePFP" alt={newMessageName} />
        //     <div className="defaultMessageName">
        //       {newMessageName}
        //       {sendingElement}
        //     </div>
        //     <div className="defaultMessageGroup">
        //       {
        //         messageIDs.map(item => {
        //           const message = thisChat["messages"].find( ({ id }) => id === item );
        //           const messageKey = "id" + item;
        //           console.debug("messageKey: " + messageKey);
        //           let lastReadElement;
        //           // if (!inChat && lastRead != null && item == lastRead && lastRead != thisChat.messages[thisChat.messages.length - 1].id) {
        //           if (lastRead != null && item == lastRead) {
        //             let myClasses = "dmsLastRead dmsIndicatorHide";
        //             if (!inChat && lastRead != thisChat.messages[thisChat.messages.length - 1].id) {
        //               myClasses = "dmsLastRead";
        //             }
        //             if (myOldMessages != null && myOldMessages[myOldMessages.length - 1].id + 1 == thisChat.messages[thisChat.messages.length - 1].id) {
        //               myClasses += " noTransition";
        //             }
        //             lastReadElement = <img src={myPerson.picture} className={myClasses} alt={myPerson.name} />;
        //           }
        //           let messageElement;
        //           if ("sending" in message) {
        //             messageElement = <p key={messageKey} className="defaultMessageText defaultMessageSending">{message.message}</p>;
        //           } else {
        //             messageElement = <p key={messageKey} title={this.parseDate(message.timestamp)} className="defaultMessageText">{message.message}{lastReadElement}</p>;
        //           }
        //
        //           return messageElement;
        //         })
        //       }
        //     </div>
        //     <h1 className="defaultMessageTimestamp">{timestampElement}</h1>
        //     <img src={myPerson.picture} className={inChatClasses} alt={myPerson.name} />
        //     <div className={inChatTypingClasses}>
        //       <div className="dmsInChatTypingDot" style={{left: "15px", animationDelay: ".25s"}}></div>
        //       <div className="dmsInChatTypingDot" style={{left: "24px", animationDelay: ".5s"}}></div>
        //       <div className="dmsInChatTypingDot"></div>
        //     </div>
        //   </div>
        // );
        const newMessage = (<DMsMessage inChat={inChat} typing={thisChat.typing} id={messageIDs[0]} key={messageIDs[0]} onUpdate={this.scrollToBottom} />);
        console.debug(newMessage);
        tempMessages.push(newMessage);
      }
    });

    console.debug("COMPLETE, HERES SENDING:");
    console.debug(hasSending);
    console.debug(handledSending);
    if (hasSending && !handledSending) {
      // let myName = this.props.myName;
      // let myPicture = this.props.myPicture;
      // const newMessage = (
      //   <div className="DMsMessage" key={"sendinggroup"}>
      //   <img src={myPicture} className="defaultMessagePFP" alt={myName} />
      //     <div className="defaultMessageName">
      //       {myName}
      //       <h1 className="defaultMessageSendingText">Sending...</h1>
      //     </div>
      //     <div className="defaultMessageGroup">
      //       {
      //         thisChat["sendingMessages"].map(item => {
      //           console.debug(item);
      //           const messageKey = "id" + item;
      //           const messageElement = <p key={messageKey} className="defaultMessageText defaultMessageSending">{item}</p>;
      //           return messageElement;
      //         })
      //       }
      //     </div>
      //   </div>
      // );

      let mySendingMessages = [];
      thisChat["sendingMessages"].map(item => {
        const messageObject = {message: item, lastRead: false, noTransition: true, sending: true, id: "sending" + mySendingMessages.length};
        mySendingMessages.push(messageObject);
      });

      let MessageType;
      if (this.props.messageStyle == "default") {
        MessageType = DMsDefaultMessage;
      }

      const newMessage = <MessageType email={this.props.myEmail} name={this.props.myName} picture={this.props.myPicture} messages={mySendingMessages} inChat={["no", true]} inChatTyping={false} onUpdate={this.props.onUpdate} />;
      console.debug(newMessage);
      tempMessages.push(newMessage);
    }

    this.setState({messages: tempMessages, loaded: true});
    if (this.messagesRef.current != null && this.messagesRef.current.scrollTop + this.messagesRef.current.clientHeight == this.messagesRef.current.scrollHeight) {
      this.shouldScroll = true;
    }
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

  handleInputChange(event) {
    var val = event.target.value;
    var iv = this.state.inputValue;
    var nowEmpty = val == "" || val == null;
    var pastEmpty = iv == "" || iv == null;
    if (pastEmpty && !nowEmpty) {
      dms_typing(this.props.openedChat, true);
    } else if (!pastEmpty && nowEmpty) {
      dms_typing(this.props.openedChat, false);
    }

    this.setState({
      inputValue: val
    });
  }

  inputEnterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13 && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();

      const iv = this.state.inputValue;
      if (iv != null && iv != "") {
        const oc = this.props.openedChat;
        setTimeout(function() {
          // dms_send_message(oc, iv);
        }, 3000);
        dms_send_message(oc, iv);
        dms_typing(this.props.openedChat, false);
        this.props.addSendingMessage({message: iv});
        this.setState({inputValue: ''});
      }
    }
  }

  render() {
    let otherName = "";
    if (this.props.getknownPeople[this.props.openedChat] != null) {
      otherName = this.props.getknownPeople[this.props.openedChat].name;
    }

    let children = (<h1 className="dmsCenterText">Loading...</h1>);
    if (this.state.loaded) {
      children = (
        <Fragment>
          <div className="dmsMessages" ref={this.messagesRef} onScroll={this.handleScroll}>
            {
              (this.props.chats[this.props.openedChat].messages == null)
              || (this.props.openedChat != "" && this.props.openedChat in this.props.chats && this.props.chats[this.props.openedChat].messages.length > 0 && this.props.chats[this.props.openedChat].messages[0].id == 0)
              || (this.props.openedChat != "" && this.props.openedChat in this.props.chats && this.props.chats[this.props.openedChat].messages.length <= 0) ?

              <div className="dmsStartConversationDiv">
                <h1 className="dmsStartConversationText">This is the start of your conversation with {otherName}</h1>
              </div>

              :

              null
            }
            {this.state.messages}
          </div>
          {this.state.messages.length > 0 ? null : <h1 className="dmsNoMessageText">No messages.<br/>Try sending one!</h1>}
          <TextareaAutosize value={this.state.inputValue} onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} placeholder="Type message here" className="dmsMessagesInput" maxLength="2000" ref={this.inputRef} />
        </Fragment>
      );
    }
    if (!(this.props.openedChat in this.props.chats)) {
      children = (<h1 className="dmsCenterText">That chat doesn't exist...</h1>);
    }

    return (
      <div className="MPDMs">
        { children }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  openedChat: state.dms.openedChat,
  chats: state.dms.chats,
  myName: state.app.name,
  myEmail: state.app.email,
  myPicture: state.app.picture,
  getknownPeople: state.people.knownPeople,
  currentPage: state.app.currentPage,
  messageStyle: state.app.messageStyle
});

const mapDispatchToProps = {
  setopenedChat,
  // addMessage,
  addSendingMessage,
  setTempMessageInput,
  setLastRead,
  setCurrentPage
}

export default connect(mapStateToProps, mapDispatchToProps)(MPDMs);
