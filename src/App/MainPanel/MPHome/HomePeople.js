import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import './HomePeople.css';
import { ReactComponent as Search } from '../../../assets/icons/search.svg';
import { getUser } from '../../../GlobalComponents/getUser.js';
import { isEmail } from '../../../GlobalComponents/smallFunctions.js';
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
      if (isEmail(this.state.searchInputVal)) {
        this.props.opendialog("profile", this.state.searchInputVal.trim());
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
      <div style={{position: "absolute", display: "flex", width: "100%", height: "calc(100% - 67px)", left: "0", top: "67px", alignItems: "center", justifyContent: "center"}}>
        <h1 style={{margin: "20%", color: "#fff5", fontSize: "16px", textAlign: "center"}}>
          No people
          { Object.keys(this.props.threads).length <= 0 ? null :
            <Fragment>
              <br/>
              <span style={{color: "#fff3", fontSize: "14px"}}>Type in the search bar to view all your known people.</span>
            </Fragment>
          }
        </h1>
      </div>
    );
    if (this.state.searchInputVal != "") {
      const isEmailVar = isEmail(this.state.searchInputVal);
      const text = isEmailVar ? "Go to profile: " + this.state.searchInputVal : "Finish email to search: " + this.state.searchInputVal;
      noPeopleElement = (
        <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
          <div className={isEmailVar ? "hpSearchButton" : "hpSearchButton hpSearchButtonDisabled"} onClick={isEmailVar ? () => this.props.opendialog("profile", this.state.searchInputVal.trim()) : null}>
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
  threads: state.groups.threads,
});

export default connect(mapStateToProps, null)(HomePeople);
