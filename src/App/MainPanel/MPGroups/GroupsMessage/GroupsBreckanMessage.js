import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-autosize-textarea';
import equal from 'fast-deep-equal/react';

// import './GroupsDefaultMessage.css';
import './GroupsBreckanMessage.css';
import '../../MessageStyles/BreckanMessage.css';
import { ReactComponent as Edit } from '../../../../assets/icons/edit.svg';
import { ReactComponent as Leave } from '../../../../assets/icons/leave.svg';
import { ReactComponent as Join } from '../../../../assets/icons/join.svg';
import { getUser } from '../../../../GlobalComponents/getUser.js';
import { parseDate } from '../../../../GlobalComponents/parseDate.js';
import { isEmail, parseEmailToName } from '../../../../GlobalComponents/smallFunctions.js';
import { groups_edit_message } from '../../../../socket.js';
import ProfilePicture from '../../../../GlobalComponents/ProfilePicture';

class GroupsBreckanMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hereTransforms: {},
      goneTransforms: {},
      extraHere: 0,
      extraGone: 0,
      editingInputVal: "",
    };

    this.inputRef = React.createRef();

    this.reloadInThread = this.reloadInThread.bind(this);
    this.inputEnterPressed = this.inputEnterPressed.bind(this);

    this.editingID = null;
    this.editingIDOriginal = "";
  }

  componentDidMount() {
    this.reloadInThread();
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

    this.reloadInThread();
  }

  reloadInThread() {
    const maxPeople = 14;

    let herePeople = [];
    let gonePeople = [];
    let myExtraHere = 0;
    let myExtraGone = 0;
    let conditionalInThread = this.props.inThread == null ? [] : Object.keys(this.props.inThread[0]);
    conditionalInThread.forEach(item => {
      if (this.props.inThread[0][item] == "here") {
        herePeople.push(item);
      } else if (this.props.inThread[0][item] == "gone") {
        gonePeople.push(item);
      }
    });
    const totalPeople = herePeople.length + gonePeople.length;
    const excessPeople = totalPeople - maxPeople;

    let myHere = {};
    let tpxIncrement = 22.5;
    let peopleToShow = herePeople.length;

    if (excessPeople > 0 && herePeople.length > maxPeople / 2) {
      if (gonePeople.length > maxPeople / 2) {
        peopleToShow = maxPeople / 2;
      } else {
        peopleToShow = maxPeople - gonePeople.length;
      }
    }
    myExtraHere = herePeople.length > peopleToShow ? herePeople.length - peopleToShow : 0;

    let transformPX = tpxIncrement * (peopleToShow - 1);
    for (let i = 0; i < peopleToShow; i++) {
      myHere[herePeople[i]] = transformPX;
      transformPX -= tpxIncrement;
    }

    let myGone = {};
    tpxIncrement = 22.5;
    peopleToShow = gonePeople.length;

    if (excessPeople > 0 && gonePeople.length > maxPeople / 2) {
      if (herePeople.length > maxPeople / 2) {
        peopleToShow = maxPeople / 2;
      } else {
        peopleToShow = maxPeople - herePeople.length;
      }
    }
    myExtraGone = gonePeople.length > peopleToShow ? gonePeople.length - peopleToShow : 0;

    transformPX = tpxIncrement * (peopleToShow - 1);
    for (let i = 0; i < peopleToShow; i++) {
      myGone[gonePeople[i]] = transformPX;
      transformPX -= tpxIncrement;
    }

    if (!equal(this.state.hereTransforms, myHere) ||
        !equal(this.state.goneTransforms, myGone) ||
        this.state.extraHere !== myExtraHere ||
        this.state.extraGone !== myExtraGone) {
      this.setState({
        hereTransforms: myHere,
        goneTransforms: myGone,
        extraHere: myExtraHere,
        extraGone: myExtraGone,
      });
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
    const who = this.props.email == this.props.myEmail ? "me" : "them";

    let inThreadElements = [];
    let here = Object.keys(this.state.hereTransforms);
    let gone = Object.keys(this.state.goneTransforms);

    let hereIndex = 0;
    const hereTimes = here.length + (this.state.extraHere > 0 ? 1 : 0);
    let separatorPushed = false;
    let goneIndex = 0;
    const goneTimes = gone.length + (this.state.extraGone > 0 ? 1 : 0);
    let i = hereTimes + (here.length > 0 && gone.length > 0 ? 1 : 0) + goneTimes;
    for (i; i > 0; i -= 1) {
      if (hereIndex < hereTimes) {
        if (hereIndex < here.length) {
          const item = here[hereIndex];
          const thisUser = getUser(item);
          // const myElement = <img src={thisUser.picture} className={"defaultInChat"} alt={thisUser.name} style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : {"transform": `translateX(${this.state.hereTransforms[item]}px)`}} />;
          const myElement = <ProfilePicture
                                    email={item}
                                    className={"defaultInChat"}
                                    style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : {"transform": `translateX(${this.state.hereTransforms[item]}px)`}} />;
          inThreadElements.push(myElement);
          const typingElement = (
            <div className={this.props.inThreadTyping.includes(item) ? "gdefaultInChatTyping" : "gdefaultInChatTyping gdefaultInChatTypingHide"} style={{"transform": `translateX(${this.state.hereTransforms[item]}px)`}}>
              <div className="gdefaultInChatTypingInner">
                <div className="defaultInChatTypingDot" style={{left: "3px", top: "11.75px"}}></div>
                <div className="defaultInChatTypingDot" style={{left: "12px", top: "11.75px", animationDelay: ".25s"}}></div>
                <div className="defaultInChatTypingDot" style={{left: "21px", top: "11.75px", animationDelay: ".5s"}}></div>
              </div>
            </div>
          )
          inThreadElements.push(typingElement);
        } else {
          const additionalPeopleStr = "+" + this.state.extraHere.toString();
          inThreadElements.push(<h1 style={{transform: "translateX(" + (this.state.hereTransforms[here[0]] + 30) + "px)"}} className="gExtraInThread" title={this.state.extraHere == 1 ? "+1 person" : additionalPeopleStr + " people"}>•••</h1>);
        }
        hereIndex++;
      } else if (here.length > 0 && gone.length > 0 && !separatorPushed) {
        inThreadElements.push(<h1 style={{position: "absolute", left: "50px", width: "15px", textAlign: "center", fontSize: "14px", transform: `translateX(${this.state.hereTransforms[here[0]] + 30 + (hereTimes == here.length + 1 ? 20 : 0)}px)`, color: "#555", margin: 0, marginTop: "6px"}}>|</h1>)
        separatorPushed = true;
      } else {
        const item = gone[goneIndex];
        const hereIndicatorCompensate = Object.keys(this.state.hereTransforms).length == 0 ? 0 : this.state.hereTransforms[here[0]] + 45 + (hereTimes == here.length + 1 ? 20 : 0);
        const thisUser = getUser(item);
        if (goneIndex < gone.length) {
          // const myElement = <img src={thisUser.picture} className={"defaultInChat defaultInChatGone"} alt={thisUser.name} style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : {"transform": `translateX(${this.state.goneTransforms[item] + hereIndicatorCompensate}px)`}} />;
          const myElement = <ProfilePicture
                                    email={item}
                                    className={"defaultInChat defaultInChatGone"}
                                    style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : {"transform": `translateX(${this.state.goneTransforms[item] + hereIndicatorCompensate}px)`}} />;
          inThreadElements.push(myElement);
        } else {
          const additionalPeopleStr = "+" + this.state.extraGone.toString();
          inThreadElements.push(<h1 style={{transform: "translateX(" + (this.state.goneTransforms[gone[0]] + hereIndicatorCompensate + 30) + "px)"}} className="gExtraInThread" title={this.state.extraGone == 1 ? "+1 person" : additionalPeopleStr + " people"}>•••</h1>);
        }
        goneIndex++;
      }
    }


    let parentStyles = {};
    let classExtension = "R";
    if (who == "me") {
      parentStyles.paddingBottom = "40px";
      classExtension = "S";
    }

    return (
      <div className="DMsBreckanMessage" style={parentStyles}>
        { this.props.email == "system" ? null :
          <Fragment>
            <ProfilePicture
              email={this.props.email}
              picture={this.props.picture}
              name={this.props.name}
              opendialog={this.props.email != this.props.myEmail ? this.props.opendialog : null}
              className={"breckanMessagePFP" + classExtension} />
            <h1 className={"breckanMessageName" + classExtension}>{this.props.name}</h1>
          </Fragment>
        }
        <div className={this.props.email != "system" ? "breckanMessageGroup" + classExtension : "defaultSystemMessage"}>
          { this.props.messages == null ? null :
            this.props.messages.map(item => {
              let lrClasses = "defaultLastRead gDefaultLastRead defaultIndicatorHide"
              if (item.lastRead) {
                lrClasses = "defaultLastRead gDefaultLastRead";
              }
              if (item.noTransition) {
                lrClasses += " noTransition";
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
                    const myPerson = getUser(item.lastRead[i]);
                    const negative = who == "me" ? "-" : "";
                    lastReadElementPictures.push(<ProfilePicture
                                                  email={item.lastRead[i]}
                                                  className={lrClasses}
                                                  style={ i == 0 ? null : {transform: "translateX(" + negative + transformPX + "px)"}} />);
                    transformPX += tpxIncrement;
                  }
                }

                if (item.lastRead.length > peopleToShow) {
                  const additionalPeopleStr = "+" + (item.lastRead.length - peopleToShow).toString();
                  const negative = who == "me" ? "-" : "";
                  lastReadElementPictures.push(<h1 style={{transform: "translateX(" + negative + (transformPX + (20 - tpxIncrement)) + "px)"}} className="gExtraLastRead" title={item.lastRead.length - peopleToShow == 1 ? "+1 person" : additionalPeopleStr + " people"}>•••</h1>);
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
                const editedElement = item.edited == false ? null : <span title={"Edited on " + parseDate(item.edited, "basic")} className="defaultMessageEditSpan">(edited)</span>;
                let editIconElement = null;
                if (this.props.email == this.props.myEmail && window.innerWidth > 880) {
                  editIconElement = <Edit className="breckanMessageEditIcon" onClick={() => this.props.setMessageEditing(item.id)} />;
                }

                return (
                  <div className={this.props.email != "system" ? "breckanMessageTextWrap" + classExtension : "defaultMessageText breckanSystemMessage"} key={"id" + item.id}>
                    { this.props.email != "system" ?
                      <div title={item.basicTimestamp} className={"breckanMessageText" + classExtension}>
                        {item.sending ? <h1 className={"defaultMessageSendingText breckanMessageSendingText" + classExtension}>Sending...</h1> : null}
                        <p>{myMessage}{editedElement}</p>
                        {lastReadElement}
                        {editIconElement}
                      </div>
                      :
                      <Fragment>
                        {MyIcon != null ? <MyIcon style={{position: "absolute", width: "15px", height: "15px", marginLeft: "-20px", fill: "#999", top: top}} /> : null}
                        <p>{myMessage}{editedElement}</p>
                        {lastReadElement}
                        {editIconElement}
                      </Fragment>
                    }
                  </div>
                );
              }

            })
          }
        </div>

        { this.props.email == "system" ? null :
          <h1 className="defaultMessageTimestamp" style={who == "me" ? {left: "unset", right: "50px"} : null}>
            {this.props.messages == null || this.props.messages.length == 0 ? "" : this.props.messages[this.props.messages.length - 1].timestamp}
          </h1>
        }
        { inThreadElements }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  myEmail: state.app.email,
});

export default connect(mapStateToProps, null)(GroupsBreckanMessage);
