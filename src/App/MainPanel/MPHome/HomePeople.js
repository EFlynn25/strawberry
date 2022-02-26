import React from 'react';
import { connect } from 'react-redux';

import './HomePeople.css';
import { ReactComponent as Search } from '../../../assets/icons/search.svg';
import { getUser } from '../../../GlobalComponents/getUser.js';
import { alphabetizePeople, searchPeople } from '../../../GlobalComponents/peopleFunctions.js';

class HomePeople extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profileEmail: "",
      showProfileViewer: true,
      searchInputVal: "",
    };

    this.onSearchInputChange = this.onSearchInputChange.bind(this);
    this.onSearchInputKeyPress = this.onSearchInputKeyPress.bind(this);
  }

  onSearchInputChange(e) {
    this.setState({
      searchInputVal: e.target.value
    });
  }

  onSearchInputKeyPress(e) {
    let code = e.keyCode || e.which;
    if (code === 13 && !e.shiftKey) {
      if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        .test(this.state.searchInputVal)) {
        this.props.opendialog("profile", this.state.searchInputVal);
      }
    }
  }

  render() {
    let people = [];
    const selectedPeopleList = this.state.searchInputVal == "" ? this.props.chats : this.props.knownPeople;

    let searchedPeople = searchPeople(Object.keys(selectedPeopleList) || [], this.state.searchInputVal);
    let alphabeticalPeople = alphabetizePeople(searchedPeople);

    const peopleElements = alphabeticalPeople.map((item) => {
      const myPerson = getUser(item);
      const personName = myPerson.name;
      const personPicture = myPerson.picture;
      const status = myPerson.status;
      const online = myPerson.online;

      return (
        <div className="hpPerson" key={item} onClick={() => this.props.opendialog("profile", item)}>
          <img src={personPicture} className="hpPFP" alt={personName} />
          { online ? <div className="hpOnline"></div> : null }
          <h1 className="hpName" style={status == null ? {lineHeight: "50px", bottom: "", top: "15px", height: "50px"} : null}>{personName}</h1>
          { status == null ? null :
            <p className="hpStatus" title={status}>{status}</p>
          }
        </div>
      );
    });

    let noPeopleElement = (
      <div style={{display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
        <h1 style={{margin: "0", color: "#fff5", fontSize: "16px"}}>No people</h1>
      </div>
    );
    if (this.state.searchInputVal != "") {
      const isEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        .test(this.state.searchInputVal);
      const text = isEmail ? "Go to profile: " + this.state.searchInputVal : "Finish email to search: " + this.state.searchInputVal;
      noPeopleElement = (
        <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
          <div className={isEmail ? "hpSearchButton" : "hpSearchButton hpSearchButtonDisabled"} onClick={isEmail ? () => this.props.opendialog("profile", this.state.searchInputVal) : null}>
            <h1>{ text }</h1>
          </div>
        </div>
      );
    }

    return (
      <div className={this.props.classes}>
        <div className="hpSearch">
          <input value={this.state.searchInputVal} onChange={this.onSearchInputChange} onKeyPress={this.onSearchInputKeyPress} placeholder="Search people" />
          <Search />
        </div>
        {
          peopleElements.length == 0 ?

          noPeopleElement
          :
          null
        }
        { peopleElements }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  knownPeople: state.people.knownPeople,
  chats: state.dms.chats,
});

export default connect(mapStateToProps, null)(HomePeople);
