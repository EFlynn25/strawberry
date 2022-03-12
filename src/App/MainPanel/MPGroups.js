// I will comment this one out another time...
// that's just so much...



import React, { Fragment } from 'react';
import { connect } from 'react-redux';
// import { Routes, Route } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';
import { Oval } from "react-loader-spinner";
import clone from 'just-clone';
import equal from 'fast-deep-equal/react';

import './MPGroups.css';
import { ReactComponent as Settings } from '../../assets/icons/settings.svg';
import { ReactComponent as Send } from '../../assets/icons/send.svg';
import { ReactComponent as Forum } from '../../assets/icons/forum.svg';
import { ReactComponent as Close } from '../../assets/icons/close.svg';
import {
  setOpenedThread,
  addSendingThreadMessage,
  setTempMessageInput,
  setLoadingMessages
} from '../../redux/groupsReducer';
import {
  setAppState
} from '../../redux/appReducer';
import {
  groups_get_messages,
  groups_join_thread,
  groups_send_message,
  groups_in_thread,
  groups_typing,
  groups_last_read
} from '../../socket.js';
import { getUser } from '../../GlobalComponents/getUser.js';
import withRouter from '../../GlobalComponents/withRouter.js';

import GroupsMessage from './MPGroups/GroupsMessage';
import GroupsDefaultMessage from './MPGroups/GroupsMessage/GroupsDefaultMessage';
import GroupsBreckanMessage from './MPGroups/GroupsMessage/GroupsBreckanMessage';
import GroupsInThread from './MPGroups/GroupsInThread';

class MPGroups extends React.Component {
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

    this.acceptedRequest = false;
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
    const openedThread = this.props.openedThread;
    const thisThread = this.props.thisThread;

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
          for (let i = myFirstID - 20; i <= myFirstID - 1; i++) {
            if (i >= 0) {
              ids.push(i);
            }
          }


          this.props.setLoadingMessages({"thread_id": this.props.openedThread, "data": ids});
          this.isLoadingMessages[openedThread] = true;
          this.heightBeforeLoading[openedThread] = this.messagesRef.current.scrollHeight;


          groups_get_messages(this.props.openedThread, myFirstID - 1, 20);
        }
      }

    }

  }

  handleWindowFocus() {
    console.log("window focused.");
    if (this.props.thisThread) {
      groups_in_thread(this.props.openedThread, true);
    }
  }

  handleWindowBlur() {
    console.log("window blurred.");
    if (this.props.thisThread) {
      groups_in_thread(this.props.openedThread, false);
    }
  }



  componentDidMount() {
    if (this.props.popout != true) {
      this.props.setOpenedThread(this.props.router.params.threadID);
    }

    console.log("[MPGroups]: componentDidMount with thread ID " + this.props.openedThread);

    const propsOpenedThread = this.props.openedThread;
    const thisThread = this.props.thisThread;
    if (this.props.thisThread) {
      this.reloadMessages(null);
      groups_in_thread(propsOpenedThread, true);
      groups_in_thread(propsOpenedThread, "get_in_thread");
      groups_typing(propsOpenedThread, "get_typing");
      groups_last_read(propsOpenedThread);

      const tmi = thisThread.tempMessageInput;
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

    if (this.props.popout != true) {
      let title = "404";
      if (this.props.thisThread) {
        title = this.props.thisThread.name;
      }
      this.props.setAppState({ currentPage: title });
    }

    window.addEventListener("focus", this.handleWindowFocus);
    window.addEventListener("blur", this.handleWindowBlur);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("[MPGroups]: componentDidUpdate with thread ID " + this.props.openedThread);

    const propsOpenedThread = this.props.openedThread;

    if (prevProps.openedThread == propsOpenedThread) {
      if (!equal(prevProps.thisThread, this.props.thisThread) || prevState.editing != this.state.editing) {
        this.reloadMessages(prevProps);
      }
    } else {
      this.setState({inputValue: '', loaded: false});
      if (this.props.thisThread) {
        this.reloadMessages(prevProps);
        if (prevProps.thisThread) {
          groups_in_thread(prevProps.openedThread, false);
          groups_typing(this.props.openedThread, false);
        }
        groups_in_thread(propsOpenedThread, true);
        groups_in_thread(propsOpenedThread, "get_in_thread");
        groups_typing(propsOpenedThread, "get_typing");
        groups_last_read(propsOpenedThread);
      }
    }

    if (!prevProps.thisThread && this.props.thisThread) {
      groups_in_thread(propsOpenedThread, true);
      groups_in_thread(propsOpenedThread, "get_in_thread");
      groups_typing(propsOpenedThread, "get_typing");
      groups_last_read(propsOpenedThread);
    }

    const thisThread = this.props.thisThread;
    if (thisThread != null) {
      const tmi = thisThread.tempMessageInput
      const iv = this.state.inputValue
      if (this.props.openedThread != "" && prevProps.openedThread != propsOpenedThread) {
        if (prevProps.thisThread) {
          this.props.setTempMessageInput({
            thread_id: prevProps.openedThread,
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

    if (this.state.loaded && prevProps.currentPage != this.props.currentPage && this.props.thisThread && window.innerWidth > 880) {
      this.inputRef.current.focus();
    }

    this.loadMoreMessages();

    if (this.props.popout != true) {
      let title = "404";
      if (this.props.thisThread) {
        title = this.props.thisThread.name;
      }
      this.props.setAppState({ currentPage: title });
    }
  }

  componentWillUnmount() {
    const iv = this.state.inputValue
    if (this.props.thisThread) {
      this.props.setTempMessageInput({
        thread_id: this.props.openedThread,
        input: iv
      });
      groups_in_thread(this.props.openedThread, false);
    }

    window.removeEventListener("focus", this.handleWindowFocus);
    window.removeEventListener("blur", this.handleWindowBlur);
  }

  reloadMessages(prevProps) {
    if (this.props.thisThread == null) {
      this.setState({
        messages: []
      });
      return false;
    }

    let thisThread = clone(this.props.thisThread);

    if (thisThread == null || thisThread.messages == null || thisThread.messages.length <= 0) {
      if (thisThread.sendingMessages == null || thisThread.sendingMessages.length <= 0) {
        this.setState({
          messages: [],
          loaded: true
        });
        return false;
      }
    }

    let hasSending = false;
    let handledSending = false;

    if ("sendingMessages" in thisThread && thisThread.sendingMessages.length > 0) {
      hasSending = true;
      let myID = 0;
      if (thisThread.messages != null && thisThread.messages.length > 0) {
        myID = thisThread.messages[thisThread.messages.length - 1].id + 1;
      }
      thisThread.sendingMessages.forEach(item => {
        const myMessage = {message: item, sending: true, id: myID};
        if (thisThread.messages != null) {
          thisThread.messages.push(myMessage);
        } else {
          thisThread.messages = [myMessage];
        }
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
          // const findNextID = thisThread["messages"].find( ({ id }) => id === localNextID );
          const findNextID = thisThread.messages[localNextID - thisThread.messages[0].id];

          if (findNextID == null) {
            break;
          }

          if ("sending" in findNextID && messageFrom == this.props.myEmail) {
            handledSending = true;
          }

          if (findNextID["from"] == messageFrom || handledSending) {
            const currentID = localNextID - thisThread.messages[0].id - 1;
            if (currentID >= 0 && findNextID["from"] != "system") {
              const minsBetween = 15;
              const currentIDObject = thisThread.messages[currentID];
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
          <GroupsMessage
            thisThread={this.props.thisThread}
            inThread={/*inThread*/null}
            typing={/*thisThread.typing*/null}
            id={messageIDs}
            key={messageIDs[0]}
            onUpdate={this.scrollToBottom}
            editing={this.state.editing}
            setMessageEditing={this.setMessageEditing}
            openedThread={this.props.openedThread}
            opendialog={this.props.opendialog} />
        );
        // console.debug(newMessage);
        tempMessages.push(newMessage);
      }

    });

    if (hasSending && !handledSending) {

      let sendingID = -1;
      let mySendingMessages = thisThread.sendingMessages.map(item => {
        sendingID++;
        return {message: item, /*lastRead: false,*/ noTransition: true, sending: true, id: "sending" + sendingID, edited: false};
      });

      let MessageType;
      if (this.props.messageStyle == "default") {
        MessageType = GroupsDefaultMessage;
      } else if (this.props.messageStyle == "breckan") {
        MessageType = GroupsBreckanMessage;
      }

      const newMessage = <MessageType
                            key={mySendingMessages[0].id}
                            email={this.props.myEmail}
                            name={this.props.myName}
                            picture={this.props.myPicture}
                            messages={mySendingMessages}
                            /*inThread={["no", true]null}*/
                            inThreadTyping={/*false*/null}
                            onUpdate={this.props.onUpdate}
                            openedThread={this.props.openedThread} />;
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
      groups_typing(this.props.openedThread, true);
    } else if (!pastEmpty && nowEmpty) {
      groups_typing(this.props.openedThread, false);
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
    const iv = this.state.inputValue;
    if (iv != null && iv != "") {
      const ot = this.props.openedThread;
      groups_send_message(ot, iv);
      groups_typing(ot, false);
      this.props.addSendingThreadMessage({message: iv, thread_id: this.props.openedThread});
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
    if (this.props.thisThread == null) {
      if (this.props.openedThread != null && !this.acceptedRequest) {
        this.acceptedRequest = true;
        groups_join_thread(this.props.openedThread);
      }
      return (
        <div className="MPGroups">
          <h1 className="mpCenterText">That thread doesn't exist...</h1>
        </div>
      )
    }

    let amountOfPeopleText = "";
    if (this.props.thisThread.people != null) {
      const amountOfPeople = this.props.thisThread.people.length;
      if (amountOfPeople == 0) {
        amountOfPeopleText = "with nobody";
      } else if (amountOfPeople == 1) {
        amountOfPeopleText = "with 1 person";
      } else {
        amountOfPeopleText = "with " + amountOfPeople + " people";
      }
    }

    let children = (<h1 className="mpCenterText">Loading...</h1>);
    if (this.state.loaded) {
      children = (
        <Fragment>
          { this.props.popout ? null :
            <div className="groupsHeader">
              <h1 className="ghName">{this.props.thisThread.name}</h1>
              <Settings className="ghSettingsIcon" onClick={() => this.props.opendialog("groupSettings", this.props.openedThread, false)} />
            </div>
          }

          <div className="mpMessages" ref={this.messagesRef} onScroll={this.handleScroll}>
            {
              (this.props.thisThread.messages == null)
              || (this.props.openedThread != "" && this.props.thisThread && this.props.thisThread.messages.length > 0 && this.props.thisThread.messages[0].id == 0)
              || (this.props.openedThread != "" && this.props.thisThread && this.props.thisThread.messages.length <= 0) ?

              <div className="mpTopTextDiv">
                <h1 className="mpStartConversationText">This is the start of your thread {amountOfPeopleText}</h1>
              </div>

              :

              null
            }
            {
              this.isLoadingMessages[this.props.openedThread] ?

              <div className="mpTopTextDiv">
                <h1 className="mpLoadingMessagesText">Loading...</h1>
                <Oval className="mpLoadingMessagesSpinner" color="var(--accent-color)" height={30} width={30} />
              </div>

              :

              null
            }
            {this.state.messages}
            <div style={{position: "relative"}}>
              <GroupsInThread thisThread={this.props.thisThread} openedThread={this.props.openedThread} myEmail={this.props.myEmail} />
            </div>
          </div>
          {this.state.messages.length > 0 ? null : <h1 className="mpNoMessageText">No messages.<br/>Try sending one!</h1>}
          <TextareaAutosize value={this.state.inputValue} onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} placeholder="Type message here" className="mpMessagesInput" maxLength={1000} ref={this.inputRef} />
          <div className="mpSendMessage groupsSendMessage" onClick={this.sendMessage}><Send /></div>
        </Fragment>
      );
    }

    return (
      <div className={this.props.popout == true ? "MPGroups mpPopoutConversation" : "MPGroups"}>
        { this.props.popout != true ? null :
          <div className="mpPopoutHandle">
            <Forum style={{fill: "#1D9545"}} />
            <h1>{ this.props.thisThread.name }</h1>
            <Settings
              className="ghSettingsIcon"
              style={{paddingLeft: "5px"}}
              onClick={() => this.props.opendialog("groupSettings", this.props.openedThread, false)} />
            <Close
              className="ghSettingsIcon"
              style={{paddingLeft: "5px"}}
              onClick={() => this.props.changePopout(this.props.openedThread, false)} />
          </div>
        }
        { children }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // threads: state.groups.threads,
  myName: state.app.name,
  myEmail: state.app.email,
  myPicture: state.app.picture,
  getknownPeople: state.people.knownPeople,
  currentPage: state.app.currentPage,
  messageStyle: state.app.messageStyle
});

const mapDispatchToProps = {
  setOpenedThread,
  // addChatMessage,
  addSendingThreadMessage,
  setTempMessageInput,
  setLoadingMessages,
  setAppState,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MPGroups));
