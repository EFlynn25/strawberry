import React from 'react';
import { connect } from 'react-redux';

import "./PersonPicker.css"
import { getUser } from "./getUser.js"

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
    var code = event.keyCode || event.which;
    if (code === 13 && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();

      if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        .test(this.state.inputValue)) {
        this.props.callback(this.state.inputValue);
        this.setState({
          inputValue: ""
        })
      }

    }
  }

  render() {
    let people = [];

    let alphabeticalPeople = [];
    const localKnownPeople = this.props.knownPeople;
    const noShow = this.props.noShow || [];
    if (localKnownPeople != null && Object.keys(localKnownPeople).length > 0) {
      Object.keys(localKnownPeople).forEach(function (item, index) {
        if (!noShow.includes(item)) {
          alphabeticalPeople.push([item, getUser(item).name]);
        }
      });
      alphabeticalPeople.sort((a,b) => a[1].toUpperCase().localeCompare(b[1].toUpperCase()));
      const newPeople = alphabeticalPeople.map(function(x) {
          return x[0];
      });

      newPeople.forEach((item) => {
        const myPerson = getUser(item);
        const personName = myPerson.name;
        const personPicture = myPerson.picture;

        const myElement = ( // "pp" stands for PersonPicker...
          <div className="ppPerson" key={item} onClick={() => this.props.callback(item)}>
            <img src={personPicture} className="ppPFP" alt={personName} />
            <h1 className="ppName">{personName}</h1>
          </div>
        );

        people.push(myElement);
      });
    }

    const newPeople = people.filter((element) => {
      const myKey = element.key.toUpperCase();
      const myName = element.props.children[1].props.children.toUpperCase();
      const iv = this.state.inputValue.toUpperCase();
      return myKey.indexOf(iv) > -1 || myName.indexOf(iv) > -1;
    });

    return(
      <div className="PersonPicker">
        <input className="ppInput" value={this.state.inputValue} onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} placeholder="Type email here" ref={this.inputRef} />
        <div className="ppPeopleDiv">
          { newPeople }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  knownPeople: state.people.knownPeople,
});

export default connect(mapStateToProps, null)(PersonPicker);
