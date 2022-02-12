import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import './GSSettings.css';
import { groups_remove_person, groups_rename_thread } from '../../../../../socket.js';
import { ReactComponent as Leave } from '../../../../../assets/icons/leave.svg';
import { ReactComponent as Close } from '../../../../../assets/icons/close.svg';
import { ReactComponent as Done } from '../../../../../assets/icons/done.svg';

class GSSettings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      leavingGroup: false,
      renameValue: "",
      renaming: false
    };

    this.handleRenameInputChange = this.handleRenameInputChange.bind(this);
    this.renameInputEnterPressed = this.renameInputEnterPressed.bind(this);
    this.renameThread = this.renameThread.bind(this);
  }

  componentDidUpdate() {
    if (!this.props.tabOpen && this.state.leavingGroup) {
      this.setState({
        leavingGroup: false
      });
    }

    if (this.state.renaming && this.props.threads[this.props.myThreadID].name == this.state.renameValue) {
      this.setState({
        renameValue: "",
        renaming: false
      });
    }
  }

  handleRenameInputChange(event) {
    this.setState({
      renameValue: event.target.value
    });
  }

  renameInputEnterPressed(event) {
    let code = event.keyCode || event.which;
    if (code === 13 && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();

      // this.props.callback(this.state.inputValue);

      // this.setState({
      //   // renameValue: "",
      //   renaming: true
      // })

      this.renameThread()

    }
  }

  renameThread() {
    const mtid = this.props.myThreadID;
    const rv = this.state.renameValue;
    if (this.props.threads[mtid].name != rv && rv != "") {
      this.setState({
        renaming: true
      })
      groups_rename_thread(mtid, rv);
    }
  }

  render() {
    let renaming = this.state.renaming;

    return(
      <div className="GSSettings">

        <h1 className="gssRenameText">Rename thread:</h1>
        <input className="gssRenameInput" value={this.state.renameValue} onChange={this.handleRenameInputChange} onKeyPress={this.renameInputEnterPressed} placeholder="Type new name here" disabled={renaming ? "disabled" : null} maxLength={48} style={renaming ? {color: "#aaa"} : null} />
        <div className={this.state.renameValue.length > 0 ? "gssRenameButton" : "gssRenameButton gssRenameButtonHide"} style={renaming ? {alignItems: "center", transform: "none", filter: "none", cursor: "initial"} : this.props.threads[this.props.myThreadID].name == this.state.renameValue ? {transform: "none", filter: "brightness(.7)", cursor: "initial"} : null} onClick={this.renameThread}>
          { renaming ? null :
            <Done style={{width: "20px", height: "25px"}} />
          }
          { !renaming ? null :
            <Fragment>
              <div className="defaultInChatTypingDot" style={{position: "initial"}}></div>
              <div className="defaultInChatTypingDot" style={{position: "initial", animationDelay: ".25s"}}></div>
              <div className="defaultInChatTypingDot" style={{position: "initial", animationDelay: ".5s"}}></div>
            </Fragment>
          }
        </div>

        <p className="gssThreadID">Thread ID: {this.props.myThreadID}</p>

        <div className="gssLeaveGroupDiv" onClick={() => {this.setState({leavingGroup: true})}}>
          <Leave className="gssLeaveGroupIcon" />
          <h1 className="gssLeaveGroupText">Leave group</h1>
        </div>
        <div className={this.state.leavingGroup ? "gssLeavingGroupDiv" : "gssLeavingGroupDiv gssLeavingGroupDivHide"}>
          <div className="gssLeavingGroup">
            <Leave />
            <h1>Leaving group</h1>
            <div><p>Are you sure you want to leave this group?</p></div>
            <Done onClick={() => {console.log("placeholder"); groups_remove_person(this.props.myThreadID, this.props.myEmail)}} />
            <Close onClick={() => {this.setState({leavingGroup: ""})}} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  myEmail: state.app.email,
  threads: state.groups.threads
});

export default connect(mapStateToProps, null)(GSSettings);
