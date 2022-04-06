// I will comment this one out another time...
// that's just so much...



import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-autosize-textarea';
import { Oval } from "react-loader-spinner";
import clone from 'just-clone';
import equal from 'fast-deep-equal/react';

import './MPDMs.css';
import { ReactComponent as Send } from '../../assets/icons/send.svg';
import { ReactComponent as ChatBubble } from '../../assets/icons/chat_bubble.svg';
import { ReactComponent as Close } from '../../assets/icons/close.svg';
import {
  setOpenedDM,
  addSendingChatMessage,
  setTempMessageInput,
  setChatLastRead,
  setLoadingMessages
} from '../../redux/dmsReducer';
import {
  setAppState
} from '../../redux/appReducer';
import {
  dms_get_messages,
  dms_send_message,
  dms_in_chat,
  dms_typing,
  dms_last_read
} from '../../socket.js';
import { getUser } from '../../GlobalComponents/getUser.js';
import withRouter from '../../GlobalComponents/withRouter.js';

import DMsMessage from './MPDMs/DMsMessage';
import DMsDefaultMessage from './MPDMs/DMsMessage/DMsDefaultMessage';
import DMsBreckanMessage from './MPDMs/DMsMessage/DMsBreckanMessage';

class MPDMs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      messages: [],
      loaded: false,
      editing: false
    };

    this.messagesRef = React.createRef();
    this.inputRef = React.createRef();

    this.handleScroll = this.handleScroll.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.loadMoreMessages = this.loadMoreMessages.bind(this);
    this.handleWindowFocus = this.handleWindowFocus.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.inputEnterPressed = this.inputEnterPressed.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.setMessageEditing = this.setMessageEditing.bind(this);

    this.shouldScroll = true;
    this.scrollsToIgnore = 0;
    this.isLoadingMessages = {};
    this.heightBeforeLoading = {};
    this.inChatOpenedDM = props.openedDM;
    this.inChatNoTransition = true;
  }

  handleScroll() {
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
    const thisChat = this.props.thisChat;

    if (thisChat != null) {

      if (thisChat.loadingMessages != null && thisChat.loadingMessages.length == 0) {
        this.isLoadingMessages[openedDM] = false;
        if (this.heightBeforeLoading[openedDM] != 0 && this.messagesRef.current != null) {
          this.messagesRef.current.scrollTop += this.messagesRef.current.scrollHeight - this.heightBeforeLoading[openedDM];
          this.heightBeforeLoading[openedDM] = 0;
        }
      }

      if (thisChat.messages != null && !this.isLoadingMessages[openedDM] && this.messagesRef != null && this.messagesRef.current != null && this.messagesRef.current.scrollTop == 0) {
        const myFirstID = thisChat.messages[0].id;
        if (myFirstID != 0) {
          let ids = [];
          for (let i = myFirstID - 20; i <= myFirstID - 1; i++) {
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
    if (this.props.thisChat) {
      dms_in_chat(this.props.openedDM, true);
    }
  }

  handleWindowBlur() {
    console.log("window blurred.");
    if (this.props.thisChat) {
      dms_in_chat(this.props.openedDM, false);
    }
  }



  componentDidMount() {
    if (this.props.popout != true) {
      this.props.setOpenedDM(this.props.router.params.chatEmail);
    }

    console.log("[MPDMs]: componentDidMount with email " + this.props.openedDM);

    const propsOpenedDM = this.props.openedDM;
    const thisChat = this.props.thisChat;
    if (this.props.thisChat) {
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

    if (this.props.popout != true) {
      let title = "404";
      if (this.props.thisChat) {
        title = getUser(this.props.openedDM).name;
      }
      this.props.setAppState({ currentPage: title });
    }

    window.addEventListener("focus", this.handleWindowFocus);
    window.addEventListener("blur", this.handleWindowBlur);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("[MPDMs]: componentDidUpdate with email " + this.props.openedDM);

    const propsOpenedDM = this.props.openedDM;
    const thisChat = this.props.thisChat;

    if (prevProps.openedDM == propsOpenedDM) {
      if (!equal(prevProps.thisChat, this.props.thisChat) || prevState.editing != this.state.editing) {
        this.reloadMessages(prevProps);
      }
    } else {
      this.setState({inputValue: '', loaded: false});
      if (this.props.thisChat) {
        this.reloadMessages(prevProps);
        if (prevProps.thisChat) {
          dms_in_chat(prevProps.openedDM, false);
          dms_typing(this.props.openedDM, false);
        }
        dms_in_chat(propsOpenedDM, true);
        dms_in_chat(propsOpenedDM, "get_in_chat");
        dms_typing(propsOpenedDM, "get_typing");
        dms_last_read(propsOpenedDM);
      }
    }

    if (prevProps.thisChat == null && this.props.thisChat) {
      dms_in_chat(propsOpenedDM, true);
      dms_in_chat(propsOpenedDM, "get_in_chat");
      dms_typing(propsOpenedDM, "get_typing");
      dms_last_read(propsOpenedDM);
    }

    if (thisChat != null) {
      const tmi = thisChat.tempMessageInput
      const iv = this.state.inputValue
      if (this.props.openedDM != "" && prevProps.openedDM != propsOpenedDM) {
        if (prevProps.thisChat) {
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

    if (this.state.loaded && prevProps.currentPage != this.props.currentPage && this.props.thisChat && window.innerWidth > 880) {
      this.inputRef.current.focus();
    }

    this.loadMoreMessages();

    if (this.props.popout != true) {
      let title = "404";
      if (this.props.thisChat) {
        title = getUser(this.props.openedDM).name;
      }
      this.props.setAppState({ currentPage: title });
    }
  }

  componentWillUnmount() {
    const iv = this.state.inputValue
    if (this.props.thisChat) {
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
    if (this.props.thisChat == null) {
      this.setState({
        messages: []
      });
      return false;
    }

    let thisChat = clone(this.props.thisChat);

    if (thisChat == null || thisChat.messages == null || thisChat.messages.length <= 0) {
      thisChat.messages = [];
      // this.setState({
      //   messages: [],
      //   loaded: true
      // });
      // return false;
    }

    let hasSending = false;
    let handledSending = false;

    if ("sendingMessages" in thisChat && thisChat["sendingMessages"].length > 0) {
      hasSending = true;
      let myID = 0;
      if (thisChat.messages && thisChat.messages.length > 0) {
        myID = thisChat.messages[thisChat.messages.length - 1].id + 1;
      } else {
        thisChat.messages = [];
      }
      thisChat.sendingMessages.forEach(item => {
        const myMessage = {message: item, sending: true, id: myID};
        thisChat.messages.push(myMessage);
        myID++;
      });
    }

    // let lastRead;
    // if (thisChat.inChat != null) {
    //   lastRead = thisChat.lastRead.them;
    // }

    let inChat = false;
    if (thisChat.inChat != null) {
      inChat = thisChat.inChat;
      // if (prevProps != null && prevProps.thisChat && prevProps.thisChat.inChat != null && prevProps.thisChat.inChat && !inChat) {
      //   lastRead = thisChat["messages"][thisChat["messages"].length - 1].id;
      // }
    }

    let tempMessages = [];
    if (thisChat.messages && thisChat.messages.length > 0) {
      let nextID = thisChat.messages[0]["id"];
      thisChat.messages.forEach((message, i) => {

        if (message["id"] >= nextID && !("sending" in message)) {
          let messageIDs = [message["id"]];
          const messageFrom = message["from"];
          while (true) {
            const localNextID = messageIDs[messageIDs.length - 1] + 1;
            const findNextID = thisChat.messages[localNextID - thisChat.messages[0].id];

            if (findNextID == null) {
              break;
            }

            if ("sending" in findNextID && messageFrom == "me") {
              handledSending = true;
            }

            if (findNextID["from"] == messageFrom || handledSending) {
              const currentID = localNextID - thisChat.messages[0].id - 1;
              if (currentID >= 0) {
                const minsBetween = 15;
                const currentIDObject = thisChat.messages[currentID];
                if (findNextID.timestamp - currentIDObject.timestamp > minsBetween * 60) {
                  break;
                }
              }
              messageIDs.push(localNextID);
              nextID = localNextID + 1;
            } else {
              break;
            }
          }
          const newMessage = (
            <DMsMessage
              thisChat={this.props.thisChat}
              inChat={inChat}
              id={messageIDs}
              key={messageIDs[0]}
              onUpdate={this.scrollToBottom}
              editing={this.state.editing}
              setMessageEditing={this.setMessageEditing}
              openedDM={this.props.openedDM}
              opendialog={this.props.opendialog} />
          );
          tempMessages.push(newMessage);
        }
      });
    }

    if (hasSending && !handledSending) {
      let mySendingMessages = [];
      thisChat["sendingMessages"].forEach(item => {
        const messageObject = {message: item, lastRead: false, noTransition: true, sending: true, id: "sending" + mySendingMessages.length, edited: false};
        mySendingMessages.push(messageObject);
      });

      let MessageType;
      if (this.props.messageStyle == "default") {
        MessageType = DMsDefaultMessage;
      } else if (this.props.messageStyle == "breckan") {
        MessageType = DMsBreckanMessage;
      }

      const newMessage = <MessageType
                            email={this.props.myEmail}
                            name={this.props.myName}
                            picture={this.props.myPicture}
                            messages={mySendingMessages}
                            onUpdate={this.props.onUpdate}
                            openedDM={this.props.openedDM} />;
      // console.debug(newMessage);
      tempMessages.push(newMessage);
    }

    this.setState({messages: tempMessages, loaded: true});
    if (this.messagesRef.current != null && this.messagesRef.current.scrollTop + this.messagesRef.current.clientHeight == this.messagesRef.current.scrollHeight) {
      this.shouldScroll = true;
    }
  }

  handleInputChange(event) {
    let val = event.target.value;
    let iv = this.state.inputValue;
    let nowEmpty = val == "" || val == null;
    let pastEmpty = iv == "" || iv == null;
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
    let code = event.keyCode || event.which;
    if (code === 13 && !event.shiftKey && window.innerWidth > 880) {
      event.preventDefault();
      event.stopPropagation();

      this.sendMessage();
    }
  }

  sendMessage() {
    this.inputRef.current.focus();
    const iv = this.state.inputValue.trim();
    if (iv != null && iv != "") {
      const oc = this.props.openedDM;
      dms_send_message(oc, iv);
      dms_typing(this.props.openedDM, false);
      this.props.addSendingChatMessage({message: iv, chat: this.props.openedDM});
      this.setState({inputValue: ''});
    }
  }

  setMessageEditing(data) {
    if (this.state.editing != data) {
      this.setState({ editing: data })
    } else if (this.state.editing == data || (data == false && this.state.editing != false)) {
      this.setState({ editing: false })
    }
  }

  render() {
    const thisChat = this.props.thisChat;
    const thisUser = getUser(this.props.openedDM);

    // in_chat class calculations
    let inChatClasses = "mpInChat";
    let typingClasses = "mpTyping";
    if (thisChat) {
      if (!thisChat.inChat) {
        const onLastMessage = thisChat.messages && thisChat.lastRead.them == thisChat.messages[thisChat.messages.length - 1].id;
        const noMessageRead = thisChat.lastRead.them == -1 && (!thisChat.messages || thisChat.messages.length == 0);
        if (onLastMessage || noMessageRead) {
          if (thisChat.sendingMessages && thisChat.sendingMessages.length > 0) {
            inChatClasses += " mpInChatHide noTransition";
          }
          inChatClasses += " mpInChatGone";
        } else {
          inChatClasses += " mpInChatHide";
        }
        typingClasses += " mpTypingHide";
      } else if (!thisChat.typing) {
        typingClasses += " mpTypingHide";
      }
      if (this.inChatOpenedDM != this.props.openedDM) {
        this.inChatOpenedDM = this.props.openedDM;
        inChatClasses += " noTransition";
        typingClasses += " noTransition";
      }
    }

    let children = (<h1 className="mpCenterText">Loading...</h1>);
    if (this.state.loaded) {
      children = (
        <Fragment>
          <div className="mpMessages" ref={this.messagesRef} onScroll={this.handleScroll}>
            {
              (this.props.thisChat.messages == null)
              || (this.props.openedDM != "" && this.props.thisChat && this.props.thisChat.messages.length > 0 && this.props.thisChat.messages[0].id == 0)
              || (this.props.openedDM != "" && this.props.thisChat && this.props.thisChat.messages.length <= 0) ?

              <div className="mpTopTextDiv">
                <h1 className="mpStartConversationText">This is the start of your conversation with {thisUser.name}</h1>
              </div>

              :

              null
            }
            {
              this.isLoadingMessages[this.props.openedDM] ?

              <div className="mpTopTextDiv">
                <h1 className="mpLoadingMessagesText">Loading...</h1>
                <Oval wrapperClass="mpLoadingMessagesSpinner" color="var(--accent-color)" secondaryColor="var(--lighter-accent-color)" height={30} width={30} />
              </div>

              :

              null
            }
            {this.state.messages}
            <div style={{position: "relative"}}>
              <img src={thisUser.picture} className={inChatClasses} alt={thisUser.name} style={/*this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : */null} />
              <div className={typingClasses} style={/*this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : */null}>
                <div className="mpTypingDot"></div>
                <div className="mpTypingDot" style={{left: "15px", animationDelay: ".25s"}}></div>
                <div className="mpTypingDot" style={{left: "24px", animationDelay: ".5s"}}></div>
              </div>
            </div>
          </div>
          {this.state.messages.length > 0 ? null : <h1 className="mpNoMessageText">No messages.<br/>Try sending one!</h1>}
          <TextareaAutosize value={this.state.inputValue} onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} placeholder="Type message here" className="mpMessagesInput" maxLength={1000} ref={this.inputRef} />
          <div className="mpSendMessage dmsSendMessage" onClick={this.sendMessage}><Send /></div>
        </Fragment>
      );
    }
    if (this.props.thisChat == null) {
      children = (<h1 className="mpCenterText">That chat doesn't exist...</h1>);
    }

    return (
      <div className={this.props.popout == true ? "MPDMs mpPopoutConversation" : "MPDMs"}>
        { this.props.popout != true ? null :
          <div className="mpPopoutHandle">
            <ChatBubble style={{fill: "#2052b6"}} />
            <h1>{ getUser(this.props.openedDM).name }</h1>
            <Close
              className="ghSettingsIcon"
              style={{padding: "0"}}
              onClick={() => this.props.changePopout(this.props.openedDM, false)} />
          </div>
        }
        { children }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  myName: state.app.name,
  myEmail: state.app.email,
  myPicture: state.app.picture,
  currentPage: state.app.currentPage,
  messageStyle: state.app.messageStyle
});

const mapDispatchToProps = {
  setOpenedDM,
  addSendingChatMessage,
  setTempMessageInput,
  setChatLastRead,
  setLoadingMessages,
  setAppState,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MPDMs));
