import React from 'react';
import equal from 'fast-deep-equal/react';

import { getUser } from '../../../GlobalComponents/getUser.js';
import ProfilePicture from '../../../GlobalComponents/ProfilePicture';

class GroupsInThread extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      herePositions: {},
      gonePositions: {},
      herePeople: [],
      gonePeople: [],
    }

    this.noTransition = false;
  }

  componentDidMount() {
    console.log("mounted");
    this.initialize();
  }

  componentDidUpdate(prevProps) {
    console.log("update");
    console.log(this.state.gonePeople);
    const thisThread = this.props.thisThread;
    console.log(thisThread);
    if (prevProps.openedThread != this.props.openedThread) {
      this.initialize();
      return true;
    }

    if (prevProps.thisThread.inThread != thisThread.inThread) {
      thisThread.inThread.forEach(item => {
        if (!this.state.herePeople.includes(item)) {
          this.addHere(item);
        }
      });
      prevProps.thisThread.inThread.forEach(item => {
        if (this.state.herePeople.includes(item) && !thisThread.inThread.includes(item)) {
          this.removeHere(item);
        }
      });
    }

    if (!equal(prevProps.thisThread.lastRead, thisThread.lastRead)) {
      const lastMessageID = thisThread.messages[thisThread.messages.length - 1].id;
      const lastRead = thisThread.lastRead;
      Object.keys(lastRead).forEach((item, i) => {
        if (lastRead[item] == lastMessageID && item != this.props.myEmail && !this.state.gonePeople.includes(item) && !this.state.herePeople.includes(item)) {
          this.addGone(item);
        }
      });
    }

    if (!equal(prevProps.thisThread.messages, thisThread.messages)) {
      const lastRead = thisThread.lastRead;
      const lastMessageID = thisThread.messages[thisThread.messages.length - 1].id;
      Object.keys(lastRead).forEach((item, i) => {
        if (lastRead[item] != lastMessageID && this.state.gonePeople.includes(item) && !this.state.herePeople.includes(item)) {
          this.removeGone(item);
        }
      });
    }

    const newSendingMessages = thisThread.sendingMessages && thisThread.sendingMessages.length > 0
                                && (!prevProps.thisThread.sendingMessages || prevProps.thisThread.sendingMessages.length == 0);
    if (newSendingMessages) {
      this.removeGone("all");
    }
  }

  initialize() {
    console.log("Initializing in_thread indicators...");
    const thisThread = this.props.thisThread;
    let newHerePos = {};
    let newGonePos = {};
    let newHerePeople = thisThread.inThread.slice();
    let newGonePeople = [];

    thisThread.people.forEach(item => {
      newHerePos[item] = 0;
      newGonePos[item] = 0;
    });
    Object.keys(thisThread.lastRead).forEach(item => {
      if ((!thisThread.sendingMessages || thisThread.sendingMessages.length == 0) && thisThread.lastRead[item] == thisThread.messages[thisThread.messages.length - 1].id
          && !newHerePeople.includes(item) && item != this.props.myEmail) {
        newGonePos[item] = newGonePeople.length * 22.5;
        newGonePeople.push(item);
      }
    });
    console.log(newGonePeople);

    this.noTransition = true;
    this.setState({ herePositions: newHerePos, gonePositions: newGonePos, herePeople: newHerePeople, gonePeople: newGonePeople }, () => {
      console.log("finished initializing")
    });
  }

  addHere(email) {
    console.log("Adding to here: " + email);
    let newHerePos = this.state.herePositions;
    let newGonePos = this.state.gonePositions;
    let newHerePeople = this.state.herePeople;
    let newGonePeople = this.state.gonePeople;

    newHerePeople.forEach(item => {
      newHerePos[item] += 22.5;
    });
    newHerePeople.unshift(email);
    newHerePos[email] = 0;

    if (newGonePeople.includes(email)) {
      const index = newGonePeople.indexOf(email);
      if (index > -1) {
        newGonePeople.splice(index, 1);
      }
      newGonePos[email] = 0;
      newGonePeople.forEach((item, i) => {
        if (i >= index) {
          newGonePos[item] -= 22.5;
        }
      });
    }

    this.setState({ herePositions: newHerePos, gonePositions: newGonePos, herePeople: newHerePeople, gonePeople: newGonePeople });
  }

  removeHere(email) {
    console.log("Removing from here: " + email);
    let newHerePos = this.state.herePositions;
    let newGonePos = this.state.gonePositions;
    let newHerePeople = this.state.herePeople;
    let newGonePeople = this.state.gonePeople;

    const index = newHerePeople.indexOf(email);
    if (index > -1) {
      newHerePeople.splice(index, 1);
    }
    newHerePos[email] = 0;
    newHerePeople.forEach((item, i) => {
      if (i >= index) {
        newHerePos[item] -= 22.5;
      }
    });

    newGonePeople.forEach(item => {
      newGonePos[item] += 22.5;
    });
    newGonePeople.unshift(email);
    newGonePos[email] = 0;

    this.setState({ herePositions: newHerePos, gonePositions: newGonePos, herePeople: newHerePeople, gonePeople: newGonePeople });
  }

  addGone(email) {
    console.log("Adding to gone: " + email);
    let newGonePos = this.state.gonePositions;
    let newGonePeople = this.state.gonePeople;

    newGonePeople.forEach(item => {
      newGonePos[item] += 22.5;
    });
    newGonePeople.unshift(email);
    newGonePos[email] = 0;

    this.setState({ gonePositions: newGonePos, gonePeople: newGonePeople });
  }

  removeGone(email) {
    console.log("Removing from gone: " + email);
    let newGonePos = this.state.gonePositions;
    let newGonePeople = this.state.gonePeople;

    if (email == "all") {
      newGonePeople = [];
      Object.keys(newGonePos).forEach(item => {
        newGonePos[item] = 0;
      });
    } else {
      const index = newGonePeople.indexOf(email);
      if (index > -1) {
        newGonePeople.splice(index, 1);
      }
      newGonePos[email] = 0;
      newGonePeople.forEach((item, i) => {
        if (i >= index) {
          newGonePos[item] -= 22.5;
        }
      });
    }

    this.setState({ gonePositions: newGonePos, gonePeople: newGonePeople });
  }

  render() {
    console.log("render");
    console.log(this.state.gonePeople);
    const thisThread = this.props.thisThread;
    if (!thisThread) {
      return null;
    }

    const nt = this.noTransition;
    if (nt) {
      this.noTransition = false;
    }

    const lastHerePos = this.state.herePeople.length > 0 ? this.state.herePositions[this.state.herePeople[this.state.herePeople.length - 1]] : 0;

    return (
      <div className="mpInThread">
        {
          thisThread.people.map((item) => {
            let myClasses = "defaultInChat defaultIndicatorHide";
            let myTypingClasses = "gdefaultInChatTyping gdefaultInChatTypingHide";
            let myStyles = {transform: `translateX(${this.state.herePositions[item]}px)`};
            if (this.state.herePeople.includes(item)) {
              myClasses = "defaultInChat";
              myStyles.zIndex = this.state.herePeople.slice().reverse().indexOf(item);
              if (this.props.thisThread.typing.includes(item)) {
                myTypingClasses = "gdefaultInChatTyping";
              }
            }
            if (nt) {
              myClasses += " noTransition";
              myTypingClasses += " noTransition";
            }
            return (
              <>
                <ProfilePicture
                  email={item}
                  key={"here" + item}
                  className={myClasses}
                  style={myStyles} />
                <div
                  className={myTypingClasses}
                  style={myStyles}>
                  <div className="gdefaultInChatTypingInner">
                    <div className="defaultInChatTypingDot" style={{left: "3px", top: "11.75px"}}></div>
                    <div className="defaultInChatTypingDot" style={{left: "12px", top: "11.75px", animationDelay: ".25s"}}></div>
                    <div className="defaultInChatTypingDot" style={{left: "21px", top: "11.75px", animationDelay: ".5s"}}></div>
                  </div>
                </div>
              </>
            );
          })
        }

        {
          this.state.herePeople.length > 0 && this.state.gonePeople.length > 0 ?
          <h1
            style={{
              position: "absolute",
              left: "50px",
              width: "15px",
              textAlign: "center",
              fontSize: "14px",
              transform: `translateX(${lastHerePos + 30}px)`,
              transition: "transform .1s",
              color: "#555",
              marginTop: "6px"
            }}>|</h1>

          : null
        }

        {
          thisThread.people.map((item) => {
            let myClasses = "defaultInChat defaultInChatGone defaultIndicatorHide";
            let myStyles = {transform: `translateX(${this.state.gonePositions[item] + lastHerePos + 45}px)`};
            if (this.state.gonePeople.includes(item)) {
              myClasses = "defaultInChat defaultInChatGone";
              myStyles.zIndex = this.state.gonePeople.slice().reverse().indexOf(item);
            }
            if (nt) {
              myClasses += " noTransition";
            }
            return (
              <ProfilePicture
                email={item}
                key={"gone" + item}
                className={myClasses}
                style={myStyles} />
            );
          })
        }
      </div>
    );
  }
}

export default GroupsInThread;
