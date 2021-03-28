import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import VisibilitySensor from 'react-visibility-sensor';

// import wlogo from '../../assets/icons/swhite.svg';
import { ReactComponent as SLogo } from '../../assets/icons/strawberry.svg';
import './MPHome.css';
import {
  sethideRightPanel,
  setCurrentPage
} from '../../redux/userReducer';

import HomeContent from './MPHome/HomeContent';

class MPHome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      homeClass: "MPHome"
    };

    this.transitionCheck = this.transitionCheck.bind(this);
  }

  componentDidMount() {
    // this.props.sethideRightPanel(true);
    this.props.setCurrentPage("Home");
  }

  componentWillUnmount() {
    // this.props.sethideRightPanel(false);
  }

  transitionCheck(isVisible) {
    if (isVisible && this.state.homeClass != "MPHome MPHomeTransition") {
      this.setState({
        homeClass: "MPHome MPHomeTransition"
      });
    }
  }

  render() {
    return (
      <VisibilitySensor onChange={this.transitionCheck}>
        <div className={this.state.homeClass}>
          <div className="mpHomeWelcome">
            <img src={this.props.picture} className="mphwPFP" alt={this.props.name} />
            <h1 className="mphwName">Hey, {this.props.name}!</h1>
          </div>

          <HomeContent />
        </div>
      </VisibilitySensor>
    );
  }
}

const mapStateToProps = (state) => ({
  picture: state.user.picture,
  name: state.user.name
});

const mapDispatchToProps = {
  sethideRightPanel,
  setCurrentPage
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MPHome));
