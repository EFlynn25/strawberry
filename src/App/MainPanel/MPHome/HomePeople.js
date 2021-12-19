import React from 'react';
import { connect } from 'react-redux';

import './HomePeople.css';
import { getUser } from '../../../GlobalComponents/getUser.js';

class HomePeople extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profileEmail: "",
      showProfileViewer: true
    };
  }

  render() {
    let people = [];

    let alphabeticalPeople = [];
    const localKnownPeople = this.props.knownPeople;
    if (localKnownPeople != null && Object.keys(localKnownPeople).length > 0) {
      Object.keys(localKnownPeople).forEach(function (item, index) {
        alphabeticalPeople.push([item, getUser(item).name]);
      });
      alphabeticalPeople.sort((a,b) => a[1].toUpperCase().localeCompare(b[1].toUpperCase()));
      const newPeople = alphabeticalPeople.map(function(x) {
          return x[0];
      });

      newPeople.forEach((item) => {
        const myPerson = getUser(item);
        const personName = myPerson.name;
        const personPicture = myPerson.picture;
        const status = myPerson.status;

        people.push(
          <div className="hpPerson" key={item} onClick={() => this.props.opendialog("profile", item)}>
            <img src={personPicture} className="hpPFP" alt={personName} />
            <h1 className="hpName" style={status == null ? {lineHeight: "50px", bottom: "", top: "15px", height: "50px"} : null}>{personName}</h1>
            { status == null ? null :
              <p className="hpStatus" title={status}>{status}</p>
            }
          </div>
        );
      });
    }

    return (
      <div className={this.props.classes}>
        {
          people.length == 0 ?

          <div style={{display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
            <h1 style={{margin: "0", color: "#fff5", fontSize: "16px"}}>No people</h1>
          </div>
          :
          null
        }
        { people }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  knownPeople: state.people.knownPeople,
  chats: state.dms.chats,
});

export default connect(mapStateToProps, null)(HomePeople);
