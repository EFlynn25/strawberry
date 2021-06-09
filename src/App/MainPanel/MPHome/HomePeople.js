import React from 'react';
import { connect } from 'react-redux';

import './HomePeople.css';
import UserProfile from './HomePeople/UserProfile';

class HomePeople extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profileEmail: "",
      showProfileViewer: true
    };

    this.checkClasses = this.checkClasses.bind(this);
  }

  componentDidMount() {
    this.checkClasses();
  }

  componentDidUpdate(prevProps) {
    this.checkClasses(prevProps);
  }

  checkClasses() {
    if (this.state.profileEmail != "") {
      this.props.opendialog();
    } else {
      this.props.closedialog();
    }

    if (!this.props.classes.includes("HomePeopleHide") && !this.state.showProfileViewer) {
      setTimeout(function() {
        this.setState({ showProfileViewer: true });
      }.bind(this), 300);
    } else if (this.props.classes.includes("HomePeopleHide") && this.state.showProfileViewer) {
      this.setState({ showProfileViewer: false });
    }
  }

  viewProfile(email) {
    console.log("view " + email);
    this.setState({
      profileEmail: email
    });
  }

  render() {
    let people = [];

    Object.keys(this.props.knownPeople).map((item) => {
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
        <div className="hpPerson" key={item} onClick={() => this.viewProfile(item)}>
          <img src={personPicture} className="hpPFP" alt={personName} />
          <h1 className="hpName">{personName}</h1>
          <p className="hpStatus" title={status}>{status}</p>
        </div>
      );
    });

    return (
      <div className={this.props.classes}>
        { people }
        { this.state.showProfileViewer ? <UserProfile email={this.state.profileEmail} onclose={() => this.setState({ profileEmail: "" })} /> : null }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  picture: state.user.picture,
  name: state.user.name,
  knownPeople: state.people.knownPeople
});

export default connect(mapStateToProps, null)(HomePeople);
