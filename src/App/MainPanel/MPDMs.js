import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';
import Loader from "react-loader-spinner";

import './MPDMs.css';
import {
  setOpenedDM,
  // addChatMessage,
  addSendingChatMessage,
  setTempMessageInput,
  setChatLastRead,
  setLoadingMessages
} from '../../redux/dmsReducer';
import {
  setCurrentPage
} from '../../redux/appReducer';
import {
  dms_get_messages,
  dms_send_message,
  dms_in_chat,
  dms_typing,
  dms_last_read
} from '../../socket.js';
import DMsMessage from './MPDMs/DMsMessage';
import DMsDefaultMessage from './MPDMs/DMsMessage/DMsDefaultMessage';

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
    this.loadMoreMessages = this.loadMoreMessages.bind(this);
    this.handleWindowFocus = this.handleWindowFocus.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);

    this.shouldScroll = true;
    this.scrollsToIgnore = 0;
    this.isLoadingMessages = {};
    this.heightBeforeLoading = {};
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

      this.loadMoreMessages();
    }
    // console.log(logtext + " | shouldScroll " + this.shouldScroll);
  }

  scrollToBottom() {
    if (this.shouldScroll && this.messagesRef.current != null) {
      if (this.messagesRef.current.scrollTop != this.messagesRef.current.scrollHeight - this.messagesRef.current.clientHeight) {
        this.scrollsToIgnore++;
      }
      this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight - this.messagesRef.current.clientHeight;
    }
  }

  loadMoreMessages() {
    const openedDM = this.props.openedDM;
    const thisChat = this.props.chats[openedDM];

    if (thisChat != null) {

      if (thisChat.loadingMessages != null && thisChat.loadingMessages.length == 0) {
        this.isLoadingMessages[openedDM] = false;
        if (this.heightBeforeLoading[openedDM] != 0) {
          this.messagesRef.current.scrollTop += this.messagesRef.current.scrollHeight - this.heightBeforeLoading[openedDM];
          this.heightBeforeLoading[openedDM] = 0;
        }
      }

      if (thisChat.messages != null && !this.isLoadingMessages[openedDM] && this.messagesRef != null && this.messagesRef.current != null && this.messagesRef.current.scrollTop == 0) {
        const myFirstID = thisChat.messages[0].id;
        if (myFirstID != 0) {
          let ids = [];
          for (var i = myFirstID - 20; i <= myFirstID - 1; i++) {
            if (i >= 0) {
              ids.push(i);
            }
          }


          this.props.setLoadingMessages({"chat": this.props.openedDM, "data": ids});
          this.isLoadingMessages[openedDM] = true;
          this.heightBeforeLoading[openedDM] = this.messagesRef.current.scrollHeight;


          dms_get_messages(this.props.openedDM, myFirstID - 1, 20);
        }
      }

    }

  }

  handleWindowFocus() {
    console.log("window focused.");
    if (this.props.openedDM in this.props.chats) {
      dms_in_chat(this.props.openedDM, true);
    }
  }

  handleWindowBlur() {
    console.log("window blurred.");
    if (this.props.openedDM in this.props.chats) {
      dms_in_chat(this.props.openedDM, false);
    }
  }



  componentDidMount() {
    this.props.setOpenedDM(this.props.match.params.chatEmail);

    console.log("[MPDMs]: componentDidMount with thread ID " + this.props.openedDM);
    //this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
    // this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight - this.messagesRef.current.clientHeight;

    const propsOpenedDM = this.props.openedDM;
    const thisChat = this.props.chats[propsOpenedDM];
    if (propsOpenedDM in this.props.chats) {
      this.reloadMessages(null);
      dms_in_chat(propsOpenedDM, true);
      dms_in_chat(propsOpenedDM, "get_in_chat");
      dms_typing(propsOpenedDM, "get_typing");
      dms_last_read(propsOpenedDM);

      const tmi = thisChat.tempMessageInput;
      if (tmi != "") {
        this.setState({
          inputValue: tmi
        });
      }

      if (tmi == "" || tmi == null) {
        dms_typing(propsOpenedDM, false);
      }

      if (this.messagesRef.current != null) {
        this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
      }
    }

    let title = "404";
    if (this.props.openedDM in this.props.chats && this.props.openedDM in this.props.getknownPeople) {
      title = this.props.getknownPeople[this.props.openedDM].name;
    }

    this.props.setCurrentPage(title);

    // const myFirstID = thisChat.messages[thisChat.messages.length - 1].id;
    // dms_get_messages(propsOpenedDM, myFirstID - 1, 20);

    window.addEventListener("focus", this.handleWindowFocus);
    window.addEventListener("blur", this.handleWindowBlur);
    // window.onblur = this.handleWindowBlur.bind(this);
    // window.addEventListener("focus", this.handleWindowBlur.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("[MPDMs]: componentDidUpdate with thread ID " + this.props.openedDM);

    const propsOpenedDM = this.props.openedDM;

    if (prevProps.openedDM == propsOpenedDM) {
      if (prevProps.chats[propsOpenedDM] != this.props.chats[propsOpenedDM]) {
        this.reloadMessages(prevProps);
      }
    } else {
      this.setState({inputValue: '', loaded: false});
      if (propsOpenedDM in this.props.chats) {
        this.reloadMessages(prevProps);
        if (prevProps.openedDM in this.props.chats) {
          dms_in_chat(prevProps.openedDM, false);
          dms_typing(this.props.openedDM, false);
        }
        dms_in_chat(propsOpenedDM, true);
        dms_in_chat(propsOpenedDM, "get_in_chat");
        dms_typing(propsOpenedDM, "get_typing");
        dms_last_read(propsOpenedDM);
      }
    }

    if (!(propsOpenedDM in prevProps.chats) && propsOpenedDM in this.props.chats) {
      dms_in_chat(propsOpenedDM, true);
      dms_in_chat(propsOpenedDM, "get_in_chat");
      dms_typing(propsOpenedDM, "get_typing");
      dms_last_read(propsOpenedDM);
    }

    const thisChat = this.props.chats[propsOpenedDM];
    if (thisChat != null) {
      const tmi = thisChat.tempMessageInput
      const iv = this.state.inputValue
      if (this.props.openedDM != "" && prevProps.openedDM != propsOpenedDM) {
        if (prevProps.openedDM in this.props.chats) {
          this.props.setTempMessageInput({
            chat: prevProps.openedDM,
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
          dms_typing(propsOpenedDM, false);
        }
      }
    }

    if (this.state.loaded && prevProps.currentPage != this.props.currentPage && propsOpenedDM in this.props.chats) {
      this.inputRef.current.focus();
    }

    this.loadMoreMessages();

    let title = "404";
    if (this.props.openedDM in this.props.chats && this.props.openedDM in this.props.getknownPeople) {
      title = this.props.getknownPeople[this.props.openedDM].name;
    }

    this.props.setCurrentPage(title);
  }

  componentWillUnmount() {
    const iv = this.state.inputValue
    if (this.props.openedDM in this.props.chats) {
      this.props.setTempMessageInput({
        chat: this.props.openedDM,
        input: iv
      });
      dms_in_chat(this.props.openedDM, false);
    }

    window.removeEventListener("focus", this.handleWindowFocus);
    window.removeEventListener("blur", this.handleWindowBlur);
  }

  reloadMessages(prevProps) {
    if (!(this.props.openedDM in this.props.chats)) {
      this.setState({
        messages: []
      });
      return false;
    }

    const thisChatReference = this.props.chats[this.props.openedDM];
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
      if (prevProps != null && this.props.openedDM in prevProps.chats && prevProps.chats[this.props.openedDM].inChat != null && prevProps.chats[this.props.openedDM].inChat && !inChat) {
        lastRead = thisChat["messages"][thisChat["messages"].length - 1].id;
      }
    }

    let nextID = thisChat["messages"][0]["id"];
    let tempMessages = [];
    thisChat["messages"].map((message, i) => {
      // console.debug(message);

      if (message["id"] >= nextID && !("sending" in message)) {
        let messageIDs = [message["id"]];
        const messageFrom = message["from"];
        // console.debug("before while");
        while (true) {
          const localNextID = messageIDs[messageIDs.length - 1] + 1;
          const findNextID = thisChat["messages"].find( ({ id }) => id === localNextID );

          // console.debug("findNextID: " + JSON.stringify(findNextID));
          // console.debug(findNextID);

          if (findNextID == null) {
            // console.debug("breaking, due to null");
            break;
          }

          if ("sending" in findNextID && messageFrom == "me") {
            // console.log("HANDLED SENDING");
            handledSending = true;
          }

          if (findNextID["from"] == messageFrom || handledSending) {
            messageIDs.push(localNextID);
            nextID = localNextID + 1;
          } else {
            // console.debug("breaking, due to new sender");
            break;
          }
        }
        // console.debug("after while... " + messageIDs);

        // const myPerson = this.props.getknownPeople[this.props.openedDM];
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
        //   myOldMessages = prevProps.chats[this.props.openedDM].messages;
        //   var firstCondition = myOldMessages != null && myOldMessages[myOldMessages.length - 1].id + 1 == thisChat.messages[thisChat.messages.length - 1].id;
        //   if (firstCondition || prevProps.openedDM != this.props.openedDM) {
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
        // console.debug(newMessage);
        tempMessages.push(newMessage);
      }
    });

    // console.debug("COMPLETE, HERES SENDING:");
    // console.debug(hasSending);
    // console.debug(handledSending);
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
      // console.debug(newMessage);
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
      dms_typing(this.props.openedDM, true);
    } else if (!pastEmpty && nowEmpty) {
      dms_typing(this.props.openedDM, false);
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
        const oc = this.props.openedDM;
        setTimeout(function() {
          // dms_send_message(oc, iv);
        }, 3000);
        dms_send_message(oc, iv);
        dms_typing(this.props.openedDM, false);
        this.props.addSendingChatMessage({message: iv});
        this.setState({inputValue: ''});
      }
    }
  }

  render() {
    let otherName = "";
    if (this.props.getknownPeople[this.props.openedDM] != null) {
      otherName = this.props.getknownPeople[this.props.openedDM].name;
    }

    let children = (<h1 className="dmsCenterText">Loading...</h1>);
    if (this.state.loaded) {
      children = (
        <Fragment>
          <div className="dmsMessages" ref={this.messagesRef} onScroll={this.handleScroll}>
            {
              (this.props.chats[this.props.openedDM].messages == null)
              || (this.props.openedDM != "" && this.props.openedDM in this.props.chats && this.props.chats[this.props.openedDM].messages.length > 0 && this.props.chats[this.props.openedDM].messages[0].id == 0)
              || (this.props.openedDM != "" && this.props.openedDM in this.props.chats && this.props.chats[this.props.openedDM].messages.length <= 0) ?

              <div className="dmsTopTextDiv">
                <h1 className="dmsStartConversationText">This is the start of your conversation with {otherName}</h1>
              </div>

              :

              null
            }
            {
              this.isLoadingMessages[this.props.openedDM] ?

              <div className="dmsTopTextDiv">
                <h1 className="dmsLoadingMessagesText">Loading...</h1>
                <Loader className="dmsLoadingMessagesSpinner" type="Oval" color="var(--accent-color)" height={30} width={30} />
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
    if (!(this.props.openedDM in this.props.chats)) {
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
  openedDM: state.dms.openedDM,
  chats: state.dms.chats,
  myName: state.app.name,
  myEmail: state.app.email,
  myPicture: state.app.picture,
  getknownPeople: state.people.knownPeople,
  currentPage: state.app.currentPage,
  messageStyle: state.app.messageStyle
});

const mapDispatchToProps = {
  setOpenedDM,
  // addChatMessage,
  addSendingChatMessage,
  setTempMessageInput,
  setChatLastRead,
  setLoadingMessages,
  setCurrentPage,
}

export default connect(mapStateToProps, mapDispatchToProps)(MPDMs);
