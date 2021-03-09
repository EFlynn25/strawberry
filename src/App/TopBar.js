import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import wlogo from '../assets/icons/swhite.svg';
import everett from '../assets/images/everett.jpeg';
import './TopBar.css';

import TBProfilePicture from './TopBar/TBProfilePicture';

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tbLogoDivClass: "tbLogoDiv",
      tbWelcomeDivClass: "tbWelcomeDiv",
      tbLeftLogoClass: "tbLeftLogo"
    };
  }

  componentDidMount() {
    this.reloadClasses();
  }

  componentDidUpdate() {
    this.reloadClasses();
  }

  reloadClasses() {
    if (this.props.history.location.pathname.startsWith("/home")) {
      if (this.state.tbLogoDivClass != "tbLogoDiv tbLogoDivHide") {
        this.setState({
          tbLogoDivClass: "tbLogoDiv tbLogoDivHide",
          tbWelcomeDivClass: "tbWelcomeDiv tbWelcomeDivHide",
          tbLeftLogoClass: "tbLeftLogo tbLeftLogoShow"
        });
      }
    } else {
      if (this.state.tbLogoDivClass != "tbLogoDiv") {
        this.setState({
          tbLogoDivClass: "tbLogoDiv",
          tbWelcomeDivClass: "tbWelcomeDiv",
          tbLeftLogoClass: "tbLeftLogo"
        });
      }
    }
  }

  render() {
    return (
      <div className="TopBar">
        {/* Left side */}
        {/*<img src={picture} className="mainPFP" alt="Profile picture" />*/}
        <div className={this.state.tbWelcomeDivClass}>
          <TBProfilePicture src={this.props.picture} />
          <h1 className="tbWelcomeText">Hey, {this.props.name}!</h1>
        </div>
        <img src={wlogo} className={this.state.tbLeftLogoClass} alt="Strawberry logo" />

        {/* Right side */}
        <div className={this.state.tbLogoDivClass}>
          <img src={wlogo} className="tbLogo" alt="Strawberry logo" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.user.name,
  email: state.user.email,
  picture: state.user.picture
});

export default connect(mapStateToProps, null)(withRouter(TopBar));
