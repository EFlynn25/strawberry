import React from 'react';
import { connect } from 'react-redux';

import './GSSettings.css';
import { groups_remove_person } from '../../../../../socket.js';
import { ReactComponent as Leave } from '../../../../../assets/icons/leave.svg';
import { ReactComponent as Close } from '../../../../../assets/icons/close.svg';
import { ReactComponent as Done } from '../../../../../assets/icons/done.svg';

class GSSettings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      leavingGroup: false
    };
  }

  componentDidUpdate() {
    if (!this.props.tabOpen && this.state.leavingGroup) {
      this.setState({
        leavingGroup: false
      });
    }
  }

  render() {
    return(
      <div className="GSSettings">
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
});

export default connect(mapStateToProps, null)(GSSettings);
