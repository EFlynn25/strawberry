import React from 'react';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-autosize-textarea';

import './DMsBreckanMessage.css';
import '../../MessageStyles/BreckanMessage.css';
import { ReactComponent as Edit } from '../../../../assets/icons/edit.svg';
import { getUser } from '../../../../GlobalComponents/getUser.js';
import { parseDate } from '../../../../GlobalComponents/parseDate.js';
import { dms_edit_message } from '../../../../socket.js';
import ProfilePicture from '../../../../GlobalComponents/ProfilePicture';

class DMsBreckanMessage extends React.Component {
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
    console.log(event)
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
    let classExtension = "R";
    if (who == "me") {
      parentStyles.paddingBottom = "40px";
      classExtension = "S";
    }

    const thisUser = getUser(this.props.openedDM);

    return (
      <div className="DMsBreckanMessage" style={parentStyles}>
        {/*<img src={this.props.picture} className={"breckanMessagePFP" + classExtension} alt={this.props.name} />*/}
        <ProfilePicture
          email={this.props.email}
          picture={this.props.picture}
          name={this.props.name}
          opendialog={this.props.email != this.props.myEmail ? this.props.opendialog : null}
          className={"breckanMessagePFP" + classExtension} />
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

              if (this.props.editing === item.id) {
                this.editingID = item.id;
                this.editingIDOriginal = item.message;
                return (
                  <div className={"breckanMessageTextWrap" + classExtension}>
                    <TextareaAutosize
                        key={"id" + item.id}
                        value={this.state.editingInputVal}
                        onChange={(event) => this.setState({ editingInputVal: event.target.value })}
                        onKeyDown={this.inputEnterPressed}
                        className="breckanMessageTextS defaultMessageEditInput"
                        maxLength={1000}
                        ref={this.inputRef}
                        style={{width: "calc(100% - 14px)"}} />
                  </div>
                );
              } else {
                if (this.props.editing - this.props.messages[0].id < 0 || this.props.messages[this.props.messages.length - 1].id < this.props.editing) {
                  this.editingID = null;
                }

                // const lastReadElement = <img src={thisUser.picture} className={lrClasses} alt={thisUser.name} />;
                const lastReadElement = <ProfilePicture
                                          email={this.props.openedDM}
                                          className={lrClasses} />;
                const editedElement = item.edited == false ? null : <span title={"Edited on " + parseDate(item.edited, "basic")} className="defaultMessageEditSpan">(edited)</span>;
                let editIconElement = null;
                if (this.props.email == this.props.myEmail && window.innerWidth > 880) {
                  editIconElement = <Edit className="breckanMessageEditIcon" onClick={() => this.props.setMessageEditing(item.id)} />;
                }
                return (
                  <div className={"breckanMessageTextWrap" + classExtension} key={"id" + item.id}>
                    <div title={item.basicTimestamp} className={"breckanMessageText" + classExtension}>
                      {item.sending ? <h1 className={"defaultMessageSendingText breckanMessageSendingText" + classExtension}>Sending...</h1> : null}
                      <p>{item.message}{editedElement}</p>
                      {lastReadElement}
                      {editIconElement}
                    </div>
                  </div>
                );
              }

            })
          }
        </div>
        <h1 className="defaultMessageTimestamp" style={who == "me" ? {left: "unset", right: "50px"} : null}>
          {this.props.messages == null || this.props.messages.length == 0 ? "" : this.props.messages[this.props.messages.length - 1].timestamp}
        </h1>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  myEmail: state.app.email,
});

export default connect(mapStateToProps, null)(DMsBreckanMessage);
