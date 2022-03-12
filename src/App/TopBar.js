import React from 'react';
import { connect } from 'react-redux';

import './TopBar.css';
import { ReactComponent as SLogo } from '../assets/icons/strawberry.svg';
import { ReactComponent as Close } from '../assets/icons/close.svg';
import withRouter from "../GlobalComponents/withRouter.js";

class TopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tbWelcomeDivClass: "tbWelcomeDiv", // Welcome div has logo on the right with the "Hey, ...!" text on the left
      tbLogoDivClass: "tbLogoDiv tbLogoDivHide", // Logo div just has the logo on the left, for when user is in the Home page
    };
  }

  componentDidMount() {
    this.reloadClasses();
  }

  componentDidUpdate() {
    this.reloadClasses();
  }

  reloadClasses() {
    if (this.props.router.location.pathname.startsWith("/home")) {
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
          <img src={this.props.picture} className="tbPFP" alt="Profile picture" />
          <h1 className="tbWelcomeText">Hey, {this.props.name}!</h1>
          <SLogo className={this.props.showLeftPanel ? "tbIconRight tbIconRightHide" : "tbIconRight"} />
          {/*<Close className={this.props.showLeftPanel || this.state.tbWelcomeDivClass.includes("Hide") ? "tbIconRight tbIconRightHide" : "tbIconRight tbIconRightHide"} onClick={this.props.hideLeftPanel} />*/}
        </div>
        <div className={this.state.tbLogoDivClass}>
          <SLogo className="tbLogoLeft" />
          { window.location.href.startsWith("https://strawberry.neonerapowered.com") ? null :
            <h1 className="tbDev">dev</h1>
          }
        </div>

        <Close
          className={this.props.showLeftPanel ? "tbIconRight" : "tbIconRight tbIconRightHide"}
          onClick={this.props.hideLeftPanel}
          style={{width: "30px", height: "30px", top: "8.5px", right: "8.5px"}} />
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
