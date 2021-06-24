import React from 'react';
import { connect } from 'react-redux';

import './HomePeople.css';

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
    Object.keys(this.props.chats).forEach(function (item, index) {
      alphabeticalPeople.push([item, localKnownPeople[item].name]);
    });
    alphabeticalPeople.sort((a,b) => a[1].toUpperCase().localeCompare(b[1].toUpperCase()));
    const newPeople = alphabeticalPeople.map(function(x) {
        return x[0];
    });

    newPeople.map((item) => {
      const personName = this.props.knownPeople[item].name;
      const personPicture = this.props.knownPeople[item].picture;
      let status = "hi im " + personName + " and this is my status";

      if (item == "everettflynn25@gmail.com") {
        status = "officially done with school, coding time.";
      } else if (item == "cherryman656@gmail.com") {
        status = "Use my other account: everettflynn25@gmail.com";
      } else if (item == "appleandroidtechmaker@gmail.com") {
        status = "This is my chat account.";
      } else if (item == "flynneverett@logoscharter.com") {
        status = "Me gusta el español.";
      }

      people.push(
        <div className="hpPerson" key={item} onClick={() => this.props.opendialog("profile", item)}>
          <img src={personPicture} className="hpPFP" alt={personName} />
          <h1 className="hpName">{personName}</h1>
          <p className="hpStatus" title={status}>{status}</p>
        </div>
      );
    });

    return (
      <div className={this.props.classes}>
        { people }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  picture: state.app.picture,
  name: state.app.name,
  knownPeople: state.people.knownPeople,
  chats: state.dms.chats,
});

export default connect(mapStateToProps, null)(HomePeople);
