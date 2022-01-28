import React from 'react';
import { connect } from 'react-redux';

import './DMsBreckanMessage.css';
import '../../MessageStyles/BreckanMessage.css';
import { getUser } from '../../../../GlobalComponents/getUser.js';

class DMsBreckanMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    if (this.props.onUpdate != null) {
      this.props.onUpdate();
    }
  }

  render() {
    const thisChat = this.props.chats[this.props.openedDM];
    const who = this.props.email == this.props.myEmail ? "me" : "them";

    let inChatClasses = "defaultInChat defaultIndicatorHide noTransition";
    let nt = true;
    if (this.props.inChat[0] == "here") {
      inChatClasses = "defaultInChat";
    } else if (this.props.inChat[0] == "gone") {
      inChatClasses = "defaultInChat defaultInChatGone";
    }
    if (this.props.inChat[1]) {
      inChatClasses += " noTransition";
    }

    let inChatTypingClasses = "defaultInChatTyping defaultInChatTypingHide";
    if (this.props.inChatTyping) {
      inChatTypingClasses = "defaultInChatTyping";
    }

    let parentStyles = {};
    if (this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending && this.props.messages[0].sending) {
      // parentStyles.marginTop = "40px";
    }

    let classExtension = "R";
    if (who == "me") {
      // parentStyles.top = "-20px";
      parentStyles.paddingBottom = "40px";
      classExtension = "S";
    }

    const thisUser = getUser(this.props.openedDM);

    return (
      <div className="DMsBreckanMessage" style={parentStyles}>
        <img src={this.props.picture} className={"breckanMessagePFP" + classExtension} alt={this.props.name} />
        <h1 className={"breckanMessageName" + classExtension}>{this.props.name}</h1>
        <div className={"breckanMessageGroup" + classExtension}>
          { this.props.messages == null ? null :
            this.props.messages.map(item => {
              let lrClasses = "defaultLastRead defaultIndicatorHide"
              if (item.lastRead) {
                lrClasses = "defaultLastRead";
              }
              if (item.noTransition) {
                lrClasses += " noTransition";
              }

              let messageClass = "breckanMessageText" + classExtension;
              if (item.sending) {
                messageClass = "breckanMessageText" + classExtension + " breckanMessageSending";
              }

              const lastReadElement = <img src={thisUser.picture} className={lrClasses} alt={thisUser.name}  style={who == "me" ? {right: "unset", left: "-40px"} : null} />;
              return (
                <p key={"id" + item.id} title={item.basicTimestamp} className={messageClass}>
                  {item.sending ? <h1 className={"defaultMessageSendingText breckanMessageSendingText" + classExtension}>Sending...</h1> : null}
                  {item.message}
                  {lastReadElement}
                </p>
              );
            })
          }
        </div>
        <h1 className="defaultMessageTimestamp" style={who == "me" ? {left: "unset", right: "50px"} : null}>
          {this.props.messages == null || this.props.messages.length == 0 ? "" : this.props.messages[this.props.messages.length - 1].timestamp}
        </h1>
        <img src={thisUser.picture} className={inChatClasses} alt={thisUser.name} style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : {bottom: "-35px"}} />
        <div style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : {bottom: "-35px"}} className={inChatTypingClasses}>
          <div className="defaultInChatTypingDot"></div>
          <div className="defaultInChatTypingDot" style={{left: "15px", animationDelay: ".25s"}}></div>
          <div className="defaultInChatTypingDot" style={{left: "24px", animationDelay: ".5s"}}></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  myEmail: state.app.email,
  openedDM: state.dms.openedDM,
  chats: state.dms.chats,
  knownPeople: state.people.knownPeople,
});

export default connect(mapStateToProps, null)(DMsBreckanMessage);
