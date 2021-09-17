import React from 'react';
import { connect } from 'react-redux';

import "./PersonPicker.css"

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

  inputEnterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13 && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();

    }
  }

  render() {
    let people = [];

    let alphabeticalPeople = [];
    const localKnownPeople = this.props.knownPeople;
    if (localKnownPeople != null && Object.keys(localKnownPeople).length > 0) {
      Object.keys(localKnownPeople).forEach(function (item, index) {
        // let myName;
        // if (localKnownPeople[item] == null) {
        //   myName = item;
        // } else {
        //   myName = localKnownPeople[item].name;
        // }
        alphabeticalPeople.push([item, localKnownPeople[item].name]);
      });
      alphabeticalPeople.sort((a,b) => a[1].toUpperCase().localeCompare(b[1].toUpperCase()));
      const newPeople = alphabeticalPeople.map(function(x) {
          return x[0];
      });

      newPeople.forEach((item) => {
        const personName = this.props.knownPeople[item].name;
        const personPicture = this.props.knownPeople[item].picture;

        const myElement = (
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
          {
            newPeople
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  knownPeople: state.people.knownPeople,
});

export default connect(mapStateToProps, null)(PersonPicker);
