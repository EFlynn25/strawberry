import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';
import Loader from "react-loader-spinner";

import './MPGroups.css';
import {
  setOpenedDM,
  // addMessage,
  addSendingMessage,
  setTempMessageInput,
  setLastRead,
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
// import GroupsMessage from './MPGroups/GroupsMessage';
// import GroupsDefaultMessage from './MPGroups/GroupsMessage/GroupsDefaultMessage';

class MPGroups extends React.Component {
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

    if (thisChat != null && thisChat.loadingMessages != null && thisChat.loadingMessages.length == 0) {
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

  handleWindowFocus() {
    console.log("window focused.");
    dms_in_chat(this.props.openedDM, true);
  }

  handleWindowBlur() {
    console.log("window blurred.");
    dms_in_chat(this.props.openedDM, false);
  }



  componentDidMount() {
    this.props.setOpenedDM(this.props.match.params.chatEmail);

    console.log("[MPGroups]: componentDidMount with thread ID " + this.props.openedDM);
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
      console.log(tmi);
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
    console.log("[MPGroups]: componentDidUpdate with thread ID " + this.props.openedDM);

    const propsOpenedDM = this.props.openedDM;

    if (prevState.loaded != this.state.loaded) {
      // this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight - this.messagesRef.current.clientHeight;
    }

    // this.scrollToBottom();

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

      if (message["id"] >= nextID && !("sending" in message)) {
        let messageIDs = [message["id"]];
        const messageFrom = message["from"];

        while (true) {
          const localNextID = messageIDs[messageIDs.length - 1] + 1;
          const findNextID = thisChat["messages"].find( ({ id }) => id === localNextID );

          if (findNextID == null) {
            break;
          }

          if ("sending" in findNextID && messageFrom == "me") {
            handledSending = true;
          }

          if (findNextID["from"] == messageFrom || handledSending) {
            messageIDs.push(localNextID);
            nextID = localNextID + 1;
          } else {
            break;
          }
        }








        const newMessage = (<GroupsMessage inChat={inChat} typing={thisChat.typing} id={messageIDs[0]} key={messageIDs[0]} onUpdate={this.scrollToBottom} />);
        // console.debug(newMessage);
        tempMessages.push(newMessage);
      }

    });

    if (hasSending && !handledSending) {

      let mySendingMessages = [];
      thisChat["sendingMessages"].map(item => {
        const messageObject = {message: item, lastRead: false, noTransition: true, sending: true, id: "sending" + mySendingMessages.length};
        mySendingMessages.push(messageObject);
      });

      let MessageType;
      if (this.props.messageStyle == "default") {
        MessageType = GroupsDefaultMessage;
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
        this.props.addSendingMessage({message: iv});
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
      <div className="MPGroups">
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
  // addMessage,
  addSendingMessage,
  setTempMessageInput,
  setLastRead,
  setLoadingMessages,
  setCurrentPage,
}

export default connect(mapStateToProps, mapDispatchToProps)(MPGroups);
