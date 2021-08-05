import React from 'react';
import { connect } from 'react-redux';

import './GroupsDefaultMessage.css';

class GroupsDefaultMessage extends React.Component {
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
    // const thisThread = this.props.threads[this.props.openedThread];

    // let inThreadClasses = "defaultInThread defaultIndicatorHide noTransition";
    // let nt = true;
    // if (this.props.inThread[0] == "here") {
    //   inThreadClasses = "defaultInThread";
    // } else if (this.props.inThread[0] == "gone") {
    //   inThreadClasses = "defaultInThread defaultInThreadGone";
    // }
    // if (this.props.inThread[1]) {
    //   inThreadClasses += " noTransition";
    // }
    //
    // let inThreadTypingClasses = "defaultInThreadTyping defaultInThreadTypingHide";
    // if (this.props.inThreadTyping) {
    //   inThreadTypingClasses = "defaultInThreadTyping";
    // }

    let parentStyles = null;
    if (this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending && this.props.messages[0].sending) {
      parentStyles = {marginTop: "40px"};
    }

    return (
      <div className="GroupsDefaultMessage" style={parentStyles}>


        <img src={this.props.picture} className="defaultMessagePFP" alt={this.props.name} />
        <div className="defaultMessageName">
          {this.props.name}
          {this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? <h1 className="defaultMessageSendingText">Sending...</h1> : null}
        </div>
        <div className="defaultMessageGroup">
          { this.props.messages == null ? null :
            this.props.messages.map(item => {
              // let lrClasses = "defaultLastRead defaultIndicatorHide"
              // if (item.lastRead) {
              //   lrClasses = "defaultLastRead";
              // }
              // if (item.noTransition) {
              //   lrClasses += " noTransition";
              // }
              //
              let messageClass = "defaultMessageText";
              if (item.sending) {
                messageClass = "defaultMessageText defaultMessageSending";
              }
              //
              // const lastReadElement = <img src={this.props.knownPeople[this.props.openedThread].picture} className={lrClasses} alt={this.props.knownPeople[this.props.openedThread].name} />;
              return (<p key={"id" + item.id} title={item.timestamp} className={messageClass}>{item.message}{/*lastReadElement*/}</p>);
            })
          }
        </div>
        <h1 className="defaultMessageTimestamp">{this.props.messages == null || this.props.messages.length == 0 ? "" : this.props.messages[this.props.messages.length - 1].timestamp/*"time lol"*/}</h1>
        {/*<img src={this.props.knownPeople[this.props.openedThread].picture} className={inThreadClasses} alt={this.props.knownPeople[this.props.openedThread].name} style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : null} />
        <div style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : null} className={inThreadTypingClasses}>
          <div className="defaultInThreadTypingDot"></div>
          <div className="defaultInThreadTypingDot" style={{left: "15px", animationDelay: ".25s"}}></div>
          <div className="defaultInThreadTypingDot" style={{left: "24px", animationDelay: ".5s"}}></div>
        </div>*/}


      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  openedThread: state.groups.openedThread,
  threads: state.groups.threads,
  knownPeople: state.people.knownPeople
});

export default connect(mapStateToProps, null)(GroupsDefaultMessage);
