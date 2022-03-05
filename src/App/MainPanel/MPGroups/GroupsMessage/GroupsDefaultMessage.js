import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-autosize-textarea';
import equal from 'fast-deep-equal/react';
import Linkify from 'react-linkify';

import './GroupsDefaultMessage.css';
import '../../MessageStyles/DefaultMessage.css';
import { ReactComponent as Edit } from '../../../../assets/icons/edit.svg';
import { ReactComponent as Leave } from '../../../../assets/icons/leave.svg';
import { ReactComponent as Join } from '../../../../assets/icons/join.svg';
import { getUser } from '../../../../GlobalComponents/getUser.js';
import { parseDate, ParseDateLive } from '../../../../GlobalComponents/parseDate.js';
import { isEmail, parseEmailToName } from '../../../../GlobalComponents/smallFunctions.js';
import { groups_edit_message } from '../../../../socket.js';
import ProfilePicture from '../../../../GlobalComponents/ProfilePicture';

class GroupsDefaultMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editingInputVal: "",
    };

    this.inputRef = React.createRef();

    this.inputEnterPressed = this.inputEnterPressed.bind(this);

    this.editingID = null;
    this.editingIDOriginal = "";
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
          const ot = this.props.openedThread;
          groups_edit_message(ot, this.props.editing, iv);
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
    let parentStyles = null;
    if (this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending && this.props.messages[0].sending) {
      // parentStyles = {marginTop: "40px"};
    }

    const lastMessage = this.props.messages[this.props.messages.length - 1];

    return (
      <div className="GroupsDefaultMessage" style={parentStyles}>

        { this.props.email == "system" ? null :
          <Fragment>
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
          </Fragment>
        }

        <div className={this.props.email == "system" ? "defaultMessageGroup gDefaultMessageGroup defaultSystemMessage" : "defaultMessageGroup gDefaultMessageGroup"}>
          { this.props.messages == null ? null :
            this.props.messages.map(item => {
              let lrClasses = "defaultLastRead gDefaultLastRead defaultIndicatorHide"
              if (item.lastRead) {
                lrClasses = "defaultLastRead gDefaultLastRead";
              }
              if (item.noTransition) {
                lrClasses += " noTransition";
              }

              let messageClass = "defaultMessageText";
              if (item.sending) {
                messageClass = "defaultMessageText defaultMessageSending";
              }

              let lastReadElementPictures = [];
              if (item.lastRead != null) {
                let transformPX = 0;
                let tpxIncrement = 12;
                let peopleToShow = item.lastRead.length;
                if (item.lastRead.length <= 4) {
                  tpxIncrement = 20;
                } else if (item.lastRead.length > 3 && item.lastRead.length <= 6) {
                  tpxIncrement = 60 / (item.lastRead.length - 1);
                } else {
                  peopleToShow = 6;
                }

                for (let i = 0; i < peopleToShow; i++) {
                  if (item.lastRead[i] != null && item.lastRead[i] != this.props.myEmail) {
                    const email = item.lastRead[i];
                    const myPerson = getUser(email);
                    lastReadElementPictures.push(<ProfilePicture
                                                  email={email}
                                                  key={email}
                                                  className={lrClasses}
                                                  style={ i == 0 ? null : {transform: "translateX(" + transformPX + "px)"}} />);
                    transformPX += tpxIncrement;
                  }
                }

                if (item.lastRead.length > peopleToShow) {
                  const additionalPeopleStr = "+" + (item.lastRead.length - peopleToShow).toString();
                  lastReadElementPictures.push(<h1 style={{transform: "translateX(" + (transformPX + (20 - tpxIncrement)) + "px)"}} className="gExtraLastRead" title={item.lastRead.length - peopleToShow == 1 ? "+1 person" : additionalPeopleStr + " people"}>•••</h1>);
                }
              }

              const lastReadElement = <div>{lastReadElementPictures}</div>;
              let myMessage = item.message;
              let MyIcon = null;
              let top = "0";
              if (this.props.email == "system") {
                if (item.message.includes("renamed")) {
                  MyIcon = Edit;
                } else if (item.message.includes("removed") || item.message.includes("left")) {
                  MyIcon = Leave;
                  top = "1px";
                } else if (item.message.includes("joined")) {
                  MyIcon = Join;
                  top = "1px";
                }
                myMessage = parseEmailToName(myMessage);
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

                // const lastReadElement = <img src={thisUser.picture} className={lrClasses} alt={thisUser.name} />;
                const editedElement = item.edited == false ? null : <span title={"Edited on " + parseDate(item.edited, "basic")} className="defaultMessageEditSpan">(edited)</span>;
                let editIconElement = null;
                if (this.props.email == this.props.myEmail && window.innerWidth > 880) {
                  editIconElement = <Edit className="defaultMessageEditIcon" onClick={() => this.props.setMessageEditing(item.id)} />;
                }
                return (
                  <div key={"id" + item.id} title={item.basicTimestamp} className={messageClass}>
                    {MyIcon != null ? <MyIcon style={{position: "absolute", width: "15px", height: "15px", marginLeft: "-20px", fill: "#999", top: top}} /> : null}
                    <Linkify><p>{myMessage}</p></Linkify>
                    {editedElement}
                    {editIconElement}
                    {lastReadElement}
                  </div>
                );
              }

            })
          }
        </div>

        { this.props.email == "system" ? null :
          <h1 className="defaultMessageTimestamp">
            {this.props.messages == null || this.props.messages.length == 0 || lastMessage.sending ? "" : <ParseDateLive timestamp={lastMessage.timestamp} format="long" />}
          </h1>
        }


      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  myEmail: state.app.email,
});

export default connect(mapStateToProps, null)(GroupsDefaultMessage);
