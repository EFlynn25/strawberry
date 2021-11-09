import React from 'react';
import { connect } from 'react-redux';

import './DMsDefaultMessage.css';
import '../../MessageStyles/DefaultMessage.css';
import { getUser } from '../../../../GlobalComponents/getUser.js';

class DMsDefaultMessage extends React.Component {
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

    let parentStyles = null;
    if (this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending && this.props.messages[0].sending) {
      parentStyles = {marginTop: "40px"};
    }

    const thisUser = getUser(this.props.openedDM);

    return (
      <div className="DMsDefaultMessage" style={parentStyles}>


        <img src={this.props.picture} className="defaultMessagePFP" alt={this.props.name} />
        <div className="defaultMessageName">
          {this.props.name}
          {this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? <h1 className="defaultMessageSendingText">Sending...</h1> : null}
        </div>
        <div className="defaultMessageGroup">
          { this.props.messages == null ? null :
            this.props.messages.map(item => {
              let lrClasses = "defaultLastRead defaultIndicatorHide"
              if (item.lastRead) {
                lrClasses = "defaultLastRead";
              }
              if (item.noTransition) {
                lrClasses += " noTransition";
              }

              let messageClass = "defaultMessageText";
              if (item.sending) {
                messageClass = "defaultMessageText defaultMessageSending";
              }

              const lastReadElement = <img src={thisUser.picture} className={lrClasses} alt={thisUser.name} />;
              return (<p key={"id" + item.id} title={item.basicTimestamp} className={messageClass}>{item.message}{lastReadElement}</p>);
            })
          }
        </div>
        <h1 className="defaultMessageTimestamp">{this.props.messages == null || this.props.messages.length == 0 ? "" : this.props.messages[this.props.messages.length - 1].timestamp/*"time lol"*/}</h1>
        <img src={thisUser.picture} className={inChatClasses} alt={thisUser.name} style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : null} />
        <div style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : null} className={inChatTypingClasses}>
          <div className="defaultInChatTypingDot"></div>
          <div className="defaultInChatTypingDot" style={{left: "15px", animationDelay: ".25s"}}></div>
          <div className="defaultInChatTypingDot" style={{left: "24px", animationDelay: ".5s"}}></div>
        </div>


      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  openedDM: state.dms.openedDM,
  chats: state.dms.chats,
  knownPeople: state.people.knownPeople
});

export default connect(mapStateToProps, null)(DMsDefaultMessage);
