import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import './LPDMs.css';
import DMChat from './LPDMs/DMChat'

class LPDMs extends React.Component {
  componentDidMount() {
    if (this.props.dmsOpenedChat != "") {
      this.props.history.push("/dms/" + this.props.dmsOpenedChat);
    }
  }

  render() {
    let children = [];

    const chatKeys = Object.keys(this.props.chats);
    if (Array.isArray(chatKeys) && chatKeys.length) {
      chatKeys.map(item => {
        console.log("item: " + item);
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
        { children }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dmsOpenedChat: state.dms.dmsOpenedChat,
  chats: state.dms.chats
});

export default connect(mapStateToProps, null)(withRouter(LPDMs));
