import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import equal from 'fast-deep-equal/react';

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
    this.reloadChats();
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.chats, prevProps.chats) || this.props.openedDM != prevProps.openedDM || !equal(this.props.knownPeople, prevProps.knownPeople)) {
      this.reloadChats();
    }
  }

  reloadChats() {
    let unreadChats = 0;

    const noMessageChats = [];
    const chats = this.props.chats;
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
        const chatElement = <DMChat
                              key={"id" + item}
                              chatEmail={item}
                              thisChat={this.props.chats[item]}
                              hideLeftPanel={this.props.hideLeftPanel}
                              changePopout={this.props.changePopout}
                              opened={this.props.openedDM == item}
                              online={this.props.knownPeople[item].online} />;
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

    if (this.props.notificationCount.dms != unreadChats) {
      this.props.setAppState({ "notificationCount.dms": unreadChats });
    }
  }

  render() {
    return (
      <div className={this.props.mainClasses}>
        <div className="lpdmChats" style={this.state.children.key == "id_no_chats" ? {overflow: "hidden"} : null}>
          { this.state.children }
        </div>
        <DMNewChat chatList={Object.keys(this.props.chats)} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  openedDM: state.dms.openedDM,
  chats: state.dms.chats,
  notificationCount: state.app.notificationCount,
  knownPeople: state.people.knownPeople
});

const mapDispatchToProps = {
  setOpenedDM,
  setAppState
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LPDMs));
