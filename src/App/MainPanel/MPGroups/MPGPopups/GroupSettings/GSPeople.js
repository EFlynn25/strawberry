import React from 'react';
import { connect } from 'react-redux';

import "./GSPeople.css"
import { groups_remove_person } from '../../../../../socket.js';
import { addThreadPeople, removeThreadPerson } from '../../../../../redux/groupsReducer.js';
import PersonPicker from '../../../../../GlobalComponents/PersonPicker.js';

import { ReactComponent as People } from '../../../../../assets/icons/people.svg';
import { ReactComponent as Settings } from '../../../../../assets/icons/settings.svg';
import { ReactComponent as Close } from '../../../../../assets/icons/close.svg';
import { ReactComponent as Done } from '../../../../../assets/icons/done.svg';
import { ReactComponent as AddPerson } from '../../../../../assets/icons/add_person.svg';

class GSPeople extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      personRemoving: "",
      personPickerOpen: false
    };

    this.personPickerRef = React.createRef();
    this.mousePressedDown = false;
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.addPerson = this.addPerson.bind(this);
    this.removePerson = this.removePerson.bind(this);
  }

  componentDidMount() {
    console.log("mount!");
    document.addEventListener('mouseup', this.handleClickOutside);
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    console.log("unmount!");
    document.removeEventListener('mouseup', this.handleClickOutside);
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.personPickerRef && !this.personPickerRef.contains(event.target) && this.state.personPickerOpen) {
      if (event.type == "mousedown") {
        this.mousePressedDown = true;
      } else if (event.type == "mouseup") {
        if (this.mousePressedDown) {
          this.setState({
            personPickerOpen: false
          });
        }
      }
    }

    if (event.type == "mouseup") {
      this.mousePressedDown = false;
    }
  }

  setWrapperRef(node) {
    if (node != null) {
      this.personPickerRef = node;
    }
  }

  addPerson(email) {
    this.props.addThreadPeople({thread_id: this.props.myThreadID, people: [email]})
  }

  removePerson(email) {
    this.props.removeThreadPerson({thread_id: this.props.myThreadID, person: email})
  }

  render() {
    let peopleElements = [];

    let alphabeticalPeople = [];
    const localKnownPeople = this.props.knownPeople;
    if (localKnownPeople != null && Object.keys(localKnownPeople).length > 0) {
      this.props.threads[this.props.myThreadID].people.forEach(function (item, index) {
        alphabeticalPeople.push([item, localKnownPeople[item].name]);
      });
      alphabeticalPeople.sort((a,b) => a[1].toUpperCase().localeCompare(b[1].toUpperCase()));
      const newPeople = alphabeticalPeople.map(function(x) {
          return x[0];
      });

      newPeople.forEach((item, i) => {
        const personName = this.props.knownPeople[item].name;
        const personPicture = this.props.knownPeople[item].picture;

        peopleElements.push(
          <div className="gspPerson" key={item} style={this.state.personRemoving == item ? {background: "#1D954522"} : null}>
            <img src={personPicture} className="gspPFP" alt={personName} />
            <h1 className="gspName" style={this.state.personRemoving == item ? {width: "calc(100% - 85px)"} : null}>{personName}</h1>
            <Close className="gspRemove" onClick={() => {this.setState({personRemoving: item})}} style={this.state.personRemoving == item ? {visibility: "visible"} : null} />
            <div className={this.state.personRemoving == item ? "gspRemovingPerson" : "gspRemovingPerson gspRemovingPersonHide"}>
              <h1>Are you sure?</h1>
              <div><p>Do you want to remove <i style={{color: "#ddd"}}>{personName}</i> from this group?</p></div>
              <Done onClick={() => {this.setState({personRemoving: ""}); this.removePerson(item)}} />
              <Close onClick={() => {this.setState({personRemoving: ""})}} />
            </div>
          </div>
        );
      });
    }

    return(
      <div className="GSPeople">
        <h1 className="gspTitle">People</h1>
        <div className="gsAddPersonDiv" onClick={() => {this.setState({personPickerOpen: true})}}>
          <AddPerson className="gsAddPersonIcon" />
          <h1 className="gsAddPersonText">Add person</h1>
        </div>
        <div className={this.state.personPickerOpen ? "gsapPicker" : "gsapPicker gsapPickerHide"} ref={this.setWrapperRef}>
          <PersonPicker callback={this.addPerson} />
        </div>
        <div className="gsPeopleList">
          {peopleElements}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  threads: state.groups.threads,
  knownPeople: state.people.knownPeople,
});

const mapDispatchToProps = {
  addThreadPeople,
  removeThreadPerson
}

export default connect(mapStateToProps, mapDispatchToProps)(GSPeople);
