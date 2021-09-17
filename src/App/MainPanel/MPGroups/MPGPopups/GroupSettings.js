import React from 'react';
import { connect } from 'react-redux';

import "./GroupSettings.css"
import { ReactComponent as People } from '../../../../assets/icons/people.svg';
import { ReactComponent as Settings } from '../../../../assets/icons/settings.svg';
import { ReactComponent as Close } from '../../../../assets/icons/close.svg';
import { ReactComponent as AddPerson } from '../../../../assets/icons/add_person.svg';

class GroupSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 0
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

  render() {
    let peopleElements = [];

    let alphabeticalPeople = [];
    // const localThreadPeople = this.props.threads[this.props.myThreadID].people;
    const localKnownPeople = this.props.knownPeople;
    if (localKnownPeople != null && Object.keys(localKnownPeople).length > 0) {
      this.props.threads[this.props.myThreadID].people.forEach(function (item, index) {
        alphabeticalPeople.push([item, localKnownPeople[item].name]);
      });
      alphabeticalPeople.sort((a,b) => a[1].toUpperCase().localeCompare(b[1].toUpperCase()));
      const newPeople = alphabeticalPeople.map(function(x) {
          return x[0];
      });

      newPeople.forEach((item) => {
        const personName = this.props.knownPeople[item].name;
        const personPicture = this.props.knownPeople[item].picture;

        peopleElements.push(
          <div className="gspPerson" key={item}>
            <img src={personPicture} className="gspPFP" alt={personName} />
            <h1 className="gspName">{personName}</h1>
            <Close className="gspRemove" />
          </div>
        );
      });
    }

    return(
      <div className="GroupSettings">
        <div className="gsTabs">
          <div className={this.state.tab == 0 ? "gsTab gsTabSelected" : "gsTab"} onClick={this.state.tab == 0 ? null : this.toggleTab}><People /></div>
          <div className={this.state.tab == 1 ? "gsTab gsTabSelected" : "gsTab"} onClick={this.state.tab == 1 ? null : this.toggleTab}><Settings /></div>
        </div>
        <div className={this.state.tab == 0 ? "gsContent" : "gsContent gsPeopleHide"}>
          <h1 className="gspTitle">People</h1>
          <div className="gsAddPersonDiv">
            <AddPerson className="gsAddPersonIcon" />
            <h1 className="gsAddPersonText">Add person</h1>
          </div>
          <div className="gsPeopleList">
            {peopleElements}
          </div>
        </div>

        <div className={this.state.tab == 1 ? "gsContent" : "gsContent gsSettingsHide"}>

          <div style={{display: "flex", width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <h1 style={{margin: "0", color: "#fff5", fontSize: "18px"}}>No settings</h1>
          </div>

        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  threads: state.groups.threads,
  knownPeople: state.people.knownPeople,
});

export default connect(mapStateToProps, null)(GroupSettings);
