import React from 'react';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-autosize-textarea';

import './DMsDefaultMessage.css';
import '../../MessageStyles/DefaultMessage.css';
import { ReactComponent as Edit } from '../../../../assets/icons/edit.svg';
import { getUser } from '../../../../GlobalComponents/getUser.js';
import { parseDate } from '../../../../GlobalComponents/parseDate.js';
import { dms_edit_message } from '../../../../socket.js';
import ProfilePicture from '../../../../GlobalComponents/ProfilePicture';

class DMsDefaultMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingInputVal: ""
    };

    this.inputRef = React.createRef();

    this.inputEnterPressed = this.inputEnterPressed.bind(this);

    this.editingID = null;
    this.editingIDOriginal = "";
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    if (this.props.onUpdate != null) {
      this.props.onUpdate();
    }

    if (prevProps.editing != this.editingID && this.editingID != null) {
      if (this.inputRef.current != null) {
        this.inputRef.current.focus()
      }
      this.setState({ editingInputVal: this.editingIDOriginal })
    }

    if (prevProps.openedDM != this.props.openedDM) {
      this.props.setMessageEditing(false);
    }
  }

  inputEnterPressed(event) {
    let code = event.keyCode || event.which;
    if (code === 13 && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();

      const iv = this.state.editingInputVal;
      if (iv != null && iv != "") {
        if (this.editingIDOriginal != iv) {
          const oc = this.props.openedDM;
          dms_edit_message(oc, this.props.editing, iv);
        }
        this.setState({editingInputVal: ''});
        this.props.setMessageEditing(false);
      }
    } else if (code == 27) {
      this.setState({editingInputVal: ''});
      this.props.setMessageEditing(false);
    }
  }

  render() {
    // const thisChat = this.props.chats[this.props.openedDM];

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


        {/*<img src={this.props.picture} className="defaultMessagePFP" alt={this.props.name} />*/}
        <ProfilePicture
          email={this.props.email}
          picture={this.props.picture}
          name={this.props.name}
          opendialog={this.props.email != this.props.myEmail ? this.props.opendialog : null}
          className="defaultMessagePFP" />
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

              if (this.props.editing === item.id) {
                this.editingID = item.id;
                this.editingIDOriginal = item.message;
                return <TextareaAutosize
                          key={"id" + item.id}
                          value={this.state.editingInputVal}
                          onChange={(event) => this.setState({ editingInputVal: event.target.value })}
                          onKeyDown={this.inputEnterPressed}
                          className="defaultMessageText defaultMessageEditInput"
                          maxLength={1000}
                          ref={this.inputRef} />;
              } else {
                if (this.props.editing - this.props.messages[0].id < 0 || this.props.messages[this.props.messages.length - 1].id < this.props.editing) {
                  this.editingID = null;
                }

                const lastReadElement = <img src={thisUser.picture} className={lrClasses} alt={thisUser.name} />;
                const editedElement = item.edited == false ? null : <span title={"Edited on " + parseDate(item.edited, "basic")} className="defaultMessageEditSpan">(edited)</span>;
                let editIconElement = null;
                if (this.props.email == this.props.myEmail && window.innerWidth > 880) {
                  editIconElement = <Edit className="defaultMessageEditIcon" onClick={() => this.props.setMessageEditing(item.id)} />;
                }
                return (
                  <div key={"id" + item.id} title={item.basicTimestamp} className={messageClass}>
                    <p>{item.message}{editedElement}</p>
                    {lastReadElement}
                    {editIconElement}
                  </div>
                );
              }
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
  myEmail: state.app.email,
  knownPeople: state.people.knownPeople
});

export default connect(mapStateToProps, null)(DMsDefaultMessage);
