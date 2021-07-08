import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { ReactComponent as SLogo } from '../assets/icons/strawberry.svg';
import './TopBar.css';

import TBProfilePicture from './TopBar/TBProfilePicture';

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tbWelcomeDivClass: "tbWelcomeDiv",
      tbLogoDivClass: "tbLogoDiv tbLogoDivHide",
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
      if (this.state.tbWelcomeDivClass != "tbWelcomeDiv tbWelcomeDivHide") {
        this.setState({
          tbWelcomeDivClass: "tbWelcomeDiv tbWelcomeDivHide",
          tbLogoDivClass: "tbLogoDiv"
        });
      }
    } else {
      if (this.state.tbWelcomeDivClass != "tbWelcomeDiv") {
        this.setState({
          tbWelcomeDivClass: "tbWelcomeDiv",
          tbLogoDivClass: "tbLogoDiv tbLogoDivHide"
        });
      }
    }
  }

  render() {
    return (
      <div className="TopBar">
        <div className={this.state.tbWelcomeDivClass}>
          {/*<TBProfilePicture src={this.props.picture} />*/}
          <img src={this.props.picture} className="tbPFP" alt="Profile picture" />
          <h1 className="tbWelcomeText">Hey, {this.props.name}!</h1>
          <SLogo className="tbLogoRight" />
        </div>
        <div className={this.state.tbLogoDivClass}>
          <SLogo className="tbLogoLeft" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.app.name,
  email: state.app.email,
  picture: state.app.picture
});

export default connect(mapStateToProps, null)(withRouter(TopBar));
