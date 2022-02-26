import React from 'react';
import { connect } from 'react-redux';

import "./PersonPicker.css"
import { getUser } from "./getUser.js"
import { isEmail } from "./smallFunctions.js"
import { alphabetizePeople, searchPeople } from "./peopleFunctions.js"

class PersonPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.inputEnterPressed = this.inputEnterPressed.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      inputValue: event.target.value
    });
  }

  inputEnterPressed(event) { // Used when the user enters and email and presses "Enter" if the user they want to add is not in the list.
    let code = event.keyCode || event.which;
    if (code === 13 && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();

      if (isEmail(this.state.inputValue)) {
        this.props.callback(this.state.inputValue);
        this.setState({
          inputValue: ""
        })
      }

    }
  }

  render() {
    let people = [];
    const localKnownPeople = this.props.knownPeople;

    let searchedPeople = searchPeople(Object.keys(localKnownPeople) || [], this.state.inputValue);
    const noShow = this.props.noShow || [];
    let alphabeticalPeople = alphabetizePeople(searchedPeople, noShow);

    const peopleElements = alphabeticalPeople.map((item) => {
      const myPerson = getUser(item);
      const personName = myPerson.name;
      const personPicture = myPerson.picture;

      return (
        <div className="ppPerson" key={item} onClick={() => this.props.callback(item)}>
          <img src={personPicture} className="ppPFP" alt={personName} />
          <h1 className="ppName">{personName}</h1>
        </div>
      );
    });

    return(
      <div className="PersonPicker">
        <input className="ppInput" value={this.state.inputValue} onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} placeholder="Type email here" ref={this.inputRef} />
        <div className="ppPeopleDiv">
          { peopleElements }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  knownPeople: state.people.knownPeople,
});

export default connect(mapStateToProps, null)(PersonPicker);
