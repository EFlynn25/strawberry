import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import './GroupsDefaultMessage.css';
import '../../MessageStyles/DefaultMessage.css';
import { getUser } from '../../../../GlobalComponents/getUser.js';
import { ReactComponent as Edit } from '../../../../assets/icons/edit.svg';
import { ReactComponent as Leave } from '../../../../assets/icons/leave.svg';
import { ReactComponent as Join } from '../../../../assets/icons/join.svg';

class GroupsDefaultMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hereTransforms: {},
      goneTransforms: {},
      extraHere: 0,
      extraGone: 0,
    };

    this.reloadInThread = this.reloadInThread.bind(this);
  }

  componentDidMount() {
    this.reloadInThread();
  }

  componentDidUpdate() {
    if (this.props.onUpdate != null) {
      this.props.onUpdate();
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
    conditionalInThread.map(item => {
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

    if (JSON.stringify(this.state.hereTransforms) !== JSON.stringify(myHere) ||
        JSON.stringify(this.state.goneTransforms) !== JSON.stringify(myGone) ||
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

    let inThreadElements = [];
    let here = Object.keys(this.state.hereTransforms);
    let gone = Object.keys(this.state.goneTransforms);

    // let inThreadLength = here.length + gone.length;
    // let tpxIncrement = 12;
    // let peopleToShow = inThreadLength;
    // if (inThreadLength <= 3) {
    //   tpxIncrement = 30;
    // } else if (inThreadLength > 3/* && inThreadLength <= 6*/) {
    //   tpxIncrement = 90 / (inThreadLength - 1);
    // } else {
    //   peopleToShow = 6;
    // }
    // let transformPX = tpxIncrement * (peopleToShow - 1);
    // const stateHereKeys = Object.keys(this.state.hereTransforms);

    // inThreadElements.push(gone.map(item => {
    //   console.log(`translateX(${transformPX}px)`);
    //   let myTransform = this.state.goneTransforms[item] + this.state.hereTransforms[stateHereKeys[0]] + 45;
    //   let myElement = <img src={this.props.knownPeople[item].picture} className={"defaultInChat defaultInChatGone"} alt={this.props.knownPeople[item].name} style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : {"transform": `translateX(${myTransform}px)`}} />;
    //   return myElement;
    // }));
    // // inThreadElements.push(<h1 style={{position: "absolute", left: "50px", width: "15px", textAlign: "center", fontSize: "14px", transform: `translateX(${this.state.hereTransforms[stateHereKeys[0]] + 30}px)`, color: "#555", margin: 0, marginTop: "6px"}}>|</h1>)
    // inThreadElements.push(here.map(item => {
    //   console.log(`translateX(${transformPX}px)`);
    //   let myElement = <img src={this.props.knownPeople[item].picture} className={"defaultInChat"} alt={this.props.knownPeople[item].name} style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : {"transform": `translateX(${this.state.hereTransforms[item]}px)`}} />;
    //   return myElement;
    // }));

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
          const myElement = <img src={thisUser.picture} className={"defaultInChat"} alt={thisUser.name} style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : {"transform": `translateX(${this.state.hereTransforms[item]}px)`}} />;
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
          const myElement = <img src={thisUser.picture} className={"defaultInChat defaultInChatGone"} alt={thisUser.name} style={this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending ? {bottom: "-15px"} : {"transform": `translateX(${this.state.goneTransforms[item] + hereIndicatorCompensate}px)`}} />;
          inThreadElements.push(myElement);
        } else {
          const additionalPeopleStr = "+" + this.state.extraGone.toString();
          inThreadElements.push(<h1 style={{transform: "translateX(" + (this.state.goneTransforms[gone[0]] + hereIndicatorCompensate + 30) + "px)"}} className="gExtraInThread" title={this.state.extraGone == 1 ? "+1 person" : additionalPeopleStr + " people"}>•••</h1>);
        }
        goneIndex++;
      }
    }


    let parentStyles = null;
    if (this.props.messages.length > 0 && this.props.messages[this.props.messages.length - 1].sending && this.props.messages[0].sending) {
      parentStyles = {marginTop: "40px"};
    }

    return (
      <div className="GroupsDefaultMessage" style={parentStyles}>

        { this.props.email == "system" ? null :
          <Fragment>
            <img src={this.props.picture} className="defaultMessagePFP" alt={this.props.name} />
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
                    console.log("YAY, ", item.lastRead[i]);
                    // const myPerson = this.props.knownPeople[item.lastRead[i]];
                    const myPerson = getUser(item.lastRead[i]);
                    // const name = myPerson != null ? myPerson.name : "Unknown person";
                    // const picture = myPerson != null ? myPerson.picture : "/assets/images/default_profile_pic.png";
                    lastReadElementPictures.push(<img style={ i == 0 ? null : {transform: "translateX(" + transformPX + "px)"}} src={myPerson.picture} className={lrClasses} alt={myPerson.name} title={myPerson.name + " (" + item.lastRead[i] + ")"} />);
                    transformPX += tpxIncrement;
                  }
                }

                if (item.lastRead.length > peopleToShow) {
                  const additionalPeopleStr = "+" + (item.lastRead.length - peopleToShow).toString();
                  lastReadElementPictures.push(<h1 style={{transform: "translateX(" + (transformPX + (20 - tpxIncrement)) + "px)"}} className="gExtraLastRead" title={item.lastRead.length - peopleToShow == 1 ? "+1 person" : additionalPeopleStr + " people"}>•••</h1>);
                }
              }

              const lastReadElement = <div>{lastReadElementPictures}</div>;
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
              }
              return (
                <p key={"id" + item.id} title={item.timestamp} className={messageClass}>
                  {MyIcon != null ? <MyIcon style={{position: "absolute", width: "15px", height: "15px", marginLeft: "-20px", fill: "#999", top: top}} /> : null}
                  {item.message}
                  {lastReadElement}
                </p>
              );

            })
          }
        </div>

        { this.props.email == "system" ? null :
          <h1 className="defaultMessageTimestamp">{this.props.messages == null || this.props.messages.length == 0 ? "" : this.props.messages[this.props.messages.length - 1].timestamp/*"time lol"*/}</h1>
        }
        { inThreadElements }

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
  myEmail: state.app.email,
  openedThread: state.groups.openedThread,
  threads: state.groups.threads,
  knownPeople: state.people.knownPeople
});

export default connect(mapStateToProps, null)(GroupsDefaultMessage);
