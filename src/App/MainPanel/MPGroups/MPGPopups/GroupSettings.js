import React from 'react';
import { connect } from 'react-redux';

import "./GroupSettings.css"
import GSPeople from './GroupSettings/GSPeople.js';
import GSSettings from './GroupSettings/GSSettings.js';

import { ReactComponent as People } from '../../../../assets/icons/people.svg';
import { ReactComponent as Settings } from '../../../../assets/icons/settings.svg';
import { ReactComponent as Close } from '../../../../assets/icons/close.svg';
import { ReactComponent as Done } from '../../../../assets/icons/done.svg';
import { ReactComponent as AddPerson } from '../../../../assets/icons/add_person.svg';

class GroupSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 0,
      personRemoving: "",
      personPickerOpen: false
    };

    this.toggleTab = this.toggleTab.bind(this);
  }

  toggleTab() {
    if (this.state.tab == 0) {
      this.setState({
        tab: 1
      });
    } else {
      this.setState({
        tab: 0
      });
    }
  }

  setWrapperRef(node) {
    if (node != null) {
      this.personPickerRef = node;
    }
  }

  componentDidUpdate() {
    if (this.props.threads[this.props.myThreadID] == null) {
      this.props.closedialog();
    }
  }

  render() {
    if (this.props.threads[this.props.myThreadID] == null) {
      return null
    }

    return(
      <div className="GroupSettings">
        <div className="gsTabs">
          <div className={this.state.tab == 0 ? "gsTab gsTabSelected" : "gsTab"} onClick={this.state.tab == 0 ? null : this.toggleTab}><People /></div>
          <div className={this.state.tab == 1 ? "gsTab gsTabSelected" : "gsTab"} onClick={this.state.tab == 1 ? null : this.toggleTab}><Settings /></div>
        </div>
        <div className={this.state.tab == 0 ? "gsContent" : "gsContent gsPeopleHide"}>
          <GSPeople myThreadID={this.props.myThreadID} />
        </div>

        <div className={this.state.tab == 1 ? "gsContent" : "gsContent gsSettingsHide"}>

          <GSSettings myThreadID={this.props.myThreadID} tabOpen={this.state.tab == 1} />

          {/*<div style={{display: "flex", width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <h1 style={{margin: "0", color: "#fff5", fontSize: "18px"}}>No settings</h1>
          </div>*/}

        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  threads: state.groups.threads,
});

export default connect(mapStateToProps, null)(GroupSettings);
