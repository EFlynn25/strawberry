import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import './LPDMs.css';
import DMChat from './LPDMs/DMChat'
import DMNewChat from './LPDMs/DMNewChat'

class LPDMs extends React.Component {
  // constructor(props) {
  //   super(props);
  //
  //   this.state = {
  //     children: []
  //   };
  // }

  componentDidMount() {
    if (this.props.openedChat != "") {
      this.props.history.push("/dms/" + this.props.openedChat);
    }
  }

  render() {
    let children = [];

    const noMessageChats = [];
    const chats = JSON.parse(JSON.stringify(this.props.chats));
    var chatTimestampList = Object.keys(chats).filter(function(key) {
      const thisChatMessages = chats[key].messages;
      if (thisChatMessages == null) {
        noMessageChats.push(key);
        return false;
      }
      return true;
    }).map(function(key) {
      const thisChatMessages = chats[key].messages;
      return [key, thisChatMessages[thisChatMessages.length - 1].timestamp];
    });
    chatTimestampList.sort(function(first, second) {
      return second[1] - first[1];
    });

    const chatKeys = chatTimestampList.map(function(x) {
        return x[0];
    });
    if (Array.isArray(noMessageChats) && noMessageChats.length) {
      noMessageChats.map(item => {
        const chatElement = <DMChat key={"id" + item} chatEmail={item} />;
        children.push(chatElement);
      });
    }
    if (Array.isArray(chatKeys) && chatKeys.length) {
      chatKeys.map(item => {
        const chatElement = <DMChat key={"id" + item} chatEmail={item} />;
        children.push(chatElement);
      });
    } else {
      children.push(
        <div key="id_no_chats" style={{display: "table", width: "100%", height: "100%"}}>
          <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px"}}>No chats</h1>
        </div>
      );
    }

    return (
      <div className="LPDMs">
        <div className="lpdmChats">
          { children }
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

export default connect(mapStateToProps, null)(withRouter(LPDMs));
