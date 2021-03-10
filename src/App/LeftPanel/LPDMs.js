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

    const chatKeys = Object.keys(this.props.chats);
    if (Array.isArray(chatKeys) && chatKeys.length) {
      chatKeys.map(item => {
        const chatElement = <DMChat key={"id" + item} chatEmail={item} />;
        children.push(chatElement);
      })
    } else {
      children.push(
        <div style={{display: "table", width: "100%", height: "100%"}}>
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
