import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import './LPDMs.css';
import {
  setNotificationCount
} from '../../redux/appReducer';
import {
  setopenedChat
} from "../../redux/dmsReducer"
import DMChat from './LPDMs/DMChat'
import DMNewChat from './LPDMs/DMNewChat'

class LPDMs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      faviconHref: "/favicon_package/favicon.ico",
      children: []
    };

    this.listOfEmails = [];

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    if (this.props.openedChat != "") {
      this.props.history.push("/dms/" + this.props.openedChat);
    }

    this.reloadChats();

    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentDidUpdate(prevProps) {
    if (this.props.chats != prevProps.chats) {
      this.reloadChats();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  reloadChats() {
    // let children = [];
    let unreadChats = 0;

    const noMessageChats = [];
    const chats = JSON.parse(JSON.stringify(this.props.chats));
    var chatTimestampList = Object.keys(chats).filter(function(key) {
      const thisChat = chats[key];
      const thisChatMessages = thisChat.messages;
      if (thisChatMessages == null) {
        noMessageChats.push(key);
        return false;
      } else {
        if (thisChatMessages[thisChatMessages.length - 1].id > thisChat.lastRead.me || thisChat.lastRead.me == null) {
          unreadChats++;
        }
      }
      return true;
    }).map(function(key) {
      const thisChatMessages = chats[key].messages;
      return [key, thisChatMessages[thisChatMessages.length - 1].timestamp];
    });
    noMessageChats.forEach(function (item, index) {
      const thisChat = chats[item];
      chatTimestampList.push([item, thisChat.created]);
    });

    chatTimestampList.sort(function(first, second) {
      return second[1] - first[1];
    });
    const chatKeys = chatTimestampList.map(function(x) {
        return x[0];
    });
    let newChildren = null;
    if (Array.isArray(chatKeys) && chatKeys.length) {
      newChildren = [];
      this.listOfEmails = chatKeys;
      chatKeys.map(item => {
        const chatElement = <DMChat key={"id" + item} chatEmail={item} />;
        newChildren.push(chatElement);
      });
    } else {
      newChildren = (
        <div key="id_no_chats" style={{display: "flex", width: "100%", height: "calc(100% + 20px)", alignItems: "center", justifyContent: "center"}}>
          <h1 style={{margin: "0", color: "#fff5", fontSize: "16px"}}>No chats</h1>
        </div>
      );
    }
    this.setState({
      children: newChildren
    });

    this.props.setNotificationCount({type: "dms", count: unreadChats});
  }

  handleKeyDown(e) {
    if (e.ctrlKey && e.which === 38) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.props.history.location.pathname.startsWith("/home")) {
        // const listOfChildrenEmails = this.state.children.map(child => child.props.chatEmail);
        // const myIndex = listOfChildrenEmails.indexOf(this.props.openedChat);

        const myIndex = this.listOfEmails.indexOf(this.props.openedChat);

        if (myIndex != 0) {
          // const newChat = listOfChildrenEmails[myIndex - 1];

          const newChat = this.listOfEmails[myIndex - 1];
          this.props.setopenedChat(newChat);
          this.props.history.push("/dms/" + newChat);
        } else {
          this.props.history.push("/home");
        }
      }

    } else if (e.ctrlKey && e.which === 40) {
      e.preventDefault();
      e.stopPropagation();

      // const listOfChildrenEmails = this.state.children.map(child => child.props.chatEmail);
      if (this.props.history.location.pathname.startsWith("/home")) {
        // const newChat = listOfChildrenEmails[0];
        const newChat = this.listOfEmails[0];
        this.props.setopenedChat(newChat);
        this.props.history.push("/dms/" + newChat);
      } else {
        // const myIndex = listOfChildrenEmails.indexOf(this.props.openedChat);

        const myIndex = this.listOfEmails.indexOf(this.props.openedChat);

        if (myIndex != this.listOfEmails.length - 1) {
        // if (myIndex != listOfChildrenEmails.length - 1) {
          // const newChat = listOfChildrenEmails[myIndex + 1];

          const newChat = this.listOfEmails[myIndex + 1];
          this.props.setopenedChat(newChat);
          this.props.history.push("/dms/" + newChat);
        }
      }

    }
  }

  render() {
    return (
      <div className={this.props.mainClasses}>
        <div className="lpdmChats" style={this.state.children.key == "id_no_chats" ? {overflow: "hidden"} : null}>
          { this.state.children }
        </div>
        <DMNewChat />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  openedChat: state.dms.openedChat,
  chats: state.dms.chats
});

const mapDispatchToProps = {
  setNotificationCount,
  setopenedChat
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LPDMs));
