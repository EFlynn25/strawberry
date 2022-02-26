import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import './LPDMs.css';
import { setAppState } from '../../redux/appReducer';
import {
  setOpenedDM
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
  }

  componentDidMount() {
    if (this.props.openedDM != "") {
      this.props.history.push("/dms/" + this.props.openedDM);
    }

    this.reloadChats();
  }

  componentDidUpdate(prevProps) {
    if (this.props.chats != prevProps.chats) {
      this.reloadChats();
    }
  }

  reloadChats() {
    // let children = [];
    let unreadChats = 0;

    const noMessageChats = [];
    const chats = JSON.parse(JSON.stringify(this.props.chats));
    let chatTimestampList = Object.keys(chats).filter(function(key) {
      const thisChat = chats[key];
      const thisChatMessages = thisChat.messages;
      if (thisChatMessages == null || thisChatMessages.length == 0) {
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
      this.props.setList("dms", chatKeys);
      chatKeys.forEach(item => {
        const chatElement = <DMChat key={"id" + item} chatEmail={item} thisChat={this.props.chats[item]} hideLeftPanel={this.props.hideLeftPanel} changePopout={this.props.changePopout} />;
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

    this.props.setAppState({ "notificationCount.dms": unreadChats });
  }

  render() {
    console.log("LPDMs render")

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
  openedDM: state.dms.openedDM,
  chats: state.dms.chats,
  dmsOrGroups: state.app.dmsOrGroups
});

const mapDispatchToProps = {
  setOpenedDM,
  setAppState
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LPDMs));
