import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';
import Loader from "react-loader-spinner";

import './MPGroups.css';
import {
  setOpenedThread,
  addSendingMessage,
  setTempMessageInput,
  setLastRead,
  setLoadingMessages
} from '../../redux/groupsReducer';
import {
  setCurrentPage
} from '../../redux/appReducer';
import {
  groups_get_messages,
  groups_send_message,
  groups_in_thread,
  groups_typing,
  groups_last_read
} from '../../socket.js';
import GroupsMessage from './MPGroups/GroupsMessage';
import GroupsDefaultMessage from './MPGroups/GroupsMessage/GroupsDefaultMessage';

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
    const openedThread = this.props.openedThread;
    const thisThread = this.props.threads[openedThread];

    if (thisThread != null) {

      if (thisThread.loadingMessages != null && thisThread.loadingMessages.length == 0) {
        this.isLoadingMessages[openedThread] = false;
        if (this.heightBeforeLoading[openedThread] != 0) {
          this.messagesRef.current.scrollTop += this.messagesRef.current.scrollHeight - this.heightBeforeLoading[openedThread];
          this.heightBeforeLoading[openedThread] = 0;
        }
      }

      if (thisThread.messages != null && !this.isLoadingMessages[openedThread] && this.messagesRef != null && this.messagesRef.current != null && this.messagesRef.current.scrollTop == 0) {
        const myFirstID = thisThread.messages[0].id;
        if (myFirstID != 0) {
          let ids = [];
          for (var i = myFirstID - 20; i <= myFirstID - 1; i++) {
            if (i >= 0) {
              ids.push(i);
            }
          }


          this.props.setLoadingMessages({"thread": this.props.openedThread, "data": ids});
          this.isLoadingMessages[openedThread] = true;
          this.heightBeforeLoading[openedThread] = this.messagesRef.current.scrollHeight;


          groups_get_messages(this.props.openedThread, myFirstID - 1, 20);
        }
      }

    }

  }

  handleWindowFocus() {
    console.log("window focused.");
    if (this.props.openedThread in this.props.threads) {
      groups_in_thread(this.props.openedThread, true);
    }
  }

  handleWindowBlur() {
    console.log("window blurred.");
    if (this.props.openedThread in this.props.threads) {
      groups_in_thread(this.props.openedThread, false);
    }
  }



  componentDidMount() {
    this.props.setOpenedThread(this.props.match.params.threadID);

    console.log("[MPGroups]: componentDidMount with thread ID " + this.props.openedThread);

    const propsOpenedThread = this.props.openedThread;
    const thisThread = this.props.threads[propsOpenedThread];
    if (propsOpenedThread in this.props.threads) {
      this.reloadMessages(null);
      groups_in_thread(propsOpenedThread, true);
      groups_in_thread(propsOpenedThread, "get_in_thread");
      groups_typing(propsOpenedThread, "get_typing");
      groups_last_read(propsOpenedThread);

      const tmi = thisThread.tempMessageInput;
      console.log(tmi);
      if (tmi != "") {
        this.setState({
          inputValue: tmi
        });
      }

      if (tmi == "" || tmi == null) {
        groups_typing(propsOpenedThread, false);
      }

      if (this.messagesRef.current != null) {
        this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
      }
    }

    let title = "404";
    if (this.props.openedThread in this.props.threads) {
      title = this.props.threads[this.props.openedThread].name;
    }

    this.props.setCurrentPage(title);

    window.addEventListener("focus", this.handleWindowFocus);
    window.addEventListener("blur", this.handleWindowBlur);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("[MPGroups]: componentDidUpdate with thread ID " + this.props.openedThread);

    const propsOpenedThread = this.props.openedThread;

    if (prevProps.openedThread == propsOpenedThread) {
      if (prevProps.threads[propsOpenedThread] != this.props.threads[propsOpenedThread]) {
        this.reloadMessages(prevProps);
      }
    } else {
      this.setState({inputValue: '', loaded: false});
      if (propsOpenedThread in this.props.threads) {
        this.reloadMessages(prevProps);
        if (prevProps.openedThread in this.props.threads) {
          groups_in_thread(prevProps.openedThread, false);
          groups_typing(this.props.openedThread, false);
        }
        groups_in_thread(propsOpenedThread, true);
        groups_in_thread(propsOpenedThread, "get_in_thread");
        groups_typing(propsOpenedThread, "get_typing");
        groups_last_read(propsOpenedThread);
      }
    }

    if (!(propsOpenedThread in prevProps.threads) && propsOpenedThread in this.props.threads) {
      groups_in_thread(propsOpenedThread, true);
      groups_in_thread(propsOpenedThread, "get_in_thread");
      groups_typing(propsOpenedThread, "get_typing");
      groups_last_read(propsOpenedThread);
    }

    const thisThread = this.props.threads[propsOpenedThread];
    if (thisThread != null) {
      const tmi = thisThread.tempMessageInput
      const iv = this.state.inputValue
      if (this.props.openedThread != "" && prevProps.openedThread != propsOpenedThread) {
        if (prevProps.openedThread in this.props.threads) {
          this.props.setTempMessageInput({
            thread: prevProps.openedThread,
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
          groups_typing(propsOpenedThread, false);
        }
      }
    }

    if (this.state.loaded && prevProps.currentPage != this.props.currentPage && propsOpenedThread in this.props.threads) {
      this.inputRef.current.focus();
    }

    this.loadMoreMessages();

    let title = "404";
    if (this.props.openedThread in this.props.threads) {
      title = this.props.threads[this.props.openedThread].name;
    }

    this.props.setCurrentPage(title);
  }

  componentWillUnmount() {
    const iv = this.state.inputValue
    if (this.props.openedThread in this.props.threads) {
      this.props.setTempMessageInput({
        thread: this.props.openedThread,
        input: iv
      });
      groups_in_thread(this.props.openedThread, false);
    }

    window.removeEventListener("focus", this.handleWindowFocus);
    window.removeEventListener("blur", this.handleWindowBlur);
  }

  reloadMessages(prevProps) {
    if (!(this.props.openedThread in this.props.threads)) {
      this.setState({
        messages: []
      });
      return false;
    }

    const thisThreadReference = this.props.threads[this.props.openedThread];
    const thisThread = JSON.parse(JSON.stringify(thisThreadReference));

    if (thisThread == null || thisThread["messages"] == null || thisThread["messages"].length <= 0) {
      if (thisThread["sendingMessages"] == null || thisThread["sendingMessages"].length <= 0) {
        this.setState({
          messages: [],
          loaded: true
        });
        return false;
      }
    }

    let hasSending = false;
    let handledSending = false;

    if ("sendingMessages" in thisThread && thisThread["sendingMessages"].length > 0) {
      hasSending = true;
      let myID = 0;
      if (thisThread.messages != null && thisThread.messages.length > 0) {
        myID = thisThread.messages[thisThread.messages.length - 1].id + 1;
      }
      thisThread["sendingMessages"].map(item => {
        const myMessage = {message: item, sending: true, id: myID};
        thisThread["messages"].push(myMessage);
        myID++;
      });
    }

    // let lastRead;
    // if (thisThread.inThread != null) {
    //   lastRead = thisThread.lastRead.them;
    // }

    // let inThread = false;
    // if (thisThread.inThread != null) {
    //   inThread = thisThread.inThread;
    //   if (prevProps != null && this.props.openedThread in prevProps.threads && prevProps.threads[this.props.openedThread].inThread != null && prevProps.threads[this.props.openedThread].inThread && !inThread) {
    //     lastRead = thisThread["messages"][thisThread["messages"].length - 1].id;
    //   }
    // }

    let nextID = thisThread["messages"][0].id;
    let tempMessages = [];
    thisThread["messages"].map((message, i) => {

      if (message["id"] >= nextID && !("sending" in message)) {
        let messageIDs = [message["id"]];
        const messageFrom = message["from"];

        while (true) {
          const localNextID = messageIDs[messageIDs.length - 1] + 1;
          const findNextID = thisThread["messages"].find( ({ id }) => id === localNextID );

          if (findNextID == null) {
            break;
          }

          if ("sending" in findNextID && messageFrom == this.props.email) {
            handledSending = true;
          }

          if (findNextID["from"] == messageFrom || handledSending) {
            messageIDs.push(localNextID);
            nextID = localNextID + 1;
          } else {
            break;
          }
        }

        const newMessage = (<GroupsMessage inThread={/*inThread*/null} typing={/*thisThread.typing*/null} id={messageIDs[0]} key={messageIDs[0]} onUpdate={this.scrollToBottom} />);
        // console.debug(newMessage);
        tempMessages.push(newMessage);
      }

    });

    if (hasSending && !handledSending) {

      let mySendingMessages = [];
      thisThread["sendingMessages"].map(item => {
        const messageObject = {message: item, /*lastRead: false,*/ noTransition: true, sending: true, id: "sending" + mySendingMessages.length};
        mySendingMessages.push(messageObject);
      });

      let MessageType;
      if (this.props.messageStyle == "default") {
        MessageType = GroupsDefaultMessage;
      }

      const newMessage = <MessageType email={this.props.myEmail} name={this.props.myName} picture={this.props.myPicture} messages={mySendingMessages} inThread={/*["no", true]*/null} inThreadTyping={/*false*/null} onUpdate={this.props.onUpdate} />;
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
      groups_typing(this.props.openedThread, true);
    } else if (!pastEmpty && nowEmpty) {
      groups_typing(this.props.openedThread, false);
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
        const oc = this.props.openedThread;
        setTimeout(function() {
          // groups_send_message(oc, iv);
        }, 3000);
        groups_send_message(oc, iv);
        groups_typing(this.props.openedThread, false);
        this.props.addSendingMessage({message: iv});
        this.setState({inputValue: ''});
      }
    }
  }

  render() {
    let amountOfPeopleText = "";
    if (this.props.threads[this.props.openedThread] != null) {
      const amountOfPeople = this.props.threads[this.props.openedThread].people.length;
      if (amountOfPeople == 1) {
        amountOfPeopleText = "with 1 person";
      } else {
        amountOfPeopleText = "with " + amountOfPeople + " people";
      }
    }

    let children = (<h1 className="groupsCenterText">Loading...</h1>);
    if (this.state.loaded) {
      children = (
        <Fragment>
          <div className="groupsMessages" ref={this.messagesRef} onScroll={this.handleScroll}>
            {
              (this.props.threads[this.props.openedThread].messages == null)
              || (this.props.openedThread != "" && this.props.openedThread in this.props.threads && this.props.threads[this.props.openedThread].messages.length > 0 && this.props.threads[this.props.openedThread].messages[0].id == 0)
              || (this.props.openedThread != "" && this.props.openedThread in this.props.threads && this.props.threads[this.props.openedThread].messages.length <= 0) ?

              <div className="groupsTopTextDiv">
                <h1 className="groupsStartConversationText">This is the start of your thread {amountOfPeopleText}</h1>
              </div>

              :

              null
            }
            {
              this.isLoadingMessages[this.props.openedThread] ?

              <div className="groupsTopTextDiv">
                <h1 className="groupsLoadingMessagesText">Loading...</h1>
                <Loader className="groupsLoadingMessagesSpinner" type="Oval" color="var(--accent-color)" height={30} width={30} />
              </div>

              :

              null
            }
            {this.state.messages}
          </div>
          {this.state.messages.length > 0 ? null : <h1 className="groupsNoMessageText">No messages.<br/>Try sending one!</h1>}
          <TextareaAutosize value={this.state.inputValue} onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} placeholder="Type message here" className="groupsMessagesInput" maxLength="2000" ref={this.inputRef} />
        </Fragment>
      );
    }
    if (!(this.props.openedThread in this.props.threads)) {
      children = (<h1 className="groupsCenterText">That thread doesn't exist...</h1>);
    }

    return (
      <div className="MPGroups">
        { children }
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
  getknownPeople: state.people.knownPeople,
  currentPage: state.app.currentPage,
  messageStyle: state.app.messageStyle
});

const mapDispatchToProps = {
  setOpenedThread,
  // addMessage,
  addSendingMessage,
  setTempMessageInput,
  setLastRead,
  setLoadingMessages,
  setCurrentPage,
}

export default connect(mapStateToProps, mapDispatchToProps)(MPGroups);