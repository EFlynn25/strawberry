import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import './LPHome.css';
import { setOpenedDM } from '../../redux/dmsReducer';
import { setOpenedThread } from '../../redux/groupsReducer';

class LPHome extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      opened: false
    };
  }

  componentDidMount() {
    if (this.props.history.location.pathname == "/home") {
      this.setState({
        opened: true
      });
    }
  }

  componentDidUpdate() {
    if (this.props.history.location.pathname == "/home" && !this.state.opened) {
      this.setState({
        opened: true
      });
      this.props.setOpenedDM("");
      this.props.setOpenedThread(null);
    } else if (this.props.history.location.pathname != "/home" && this.state.opened) {
      this.setState({
        opened: false
      });
    }
  }

  handleClick(e) {
    e.preventDefault();

    this.props.history.push("/home");
  }

  render () {
    let opened = false;
    if (this.props.history.location.pathname == "/home") {
      opened = true;
    }

    return (
      <div className="LPHome" onClick={this.handleClick} style={{backgroundPositionX: opened ? "0" : ""}}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={opened ? "homeIcon homeIconAnimate" : "homeIcon"}>
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        { this.props.dms_requests.length > 0 || Object.keys(this.props.groups_requests).length > 0 ?
          <div className="hwUnreadDot" style={{top: "32.5px", right: "20px"}}></div>
          : null
        }
        <h1 className="homeText">Home</h1>
        <div className="homeSelected" style={{transform: opened ? "none" : ""}} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dms_requests: state.dms.requests,
  groups_requests: state.groups.requests,
});

const mapDispatchToProps = {
  setOpenedDM,
  setOpenedThread
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LPHome));
