import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import './LPHome.css';
import {
  setOpenedDM
} from '../../redux/dmsReducer';

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
      <div className="LPHome" onClick={this.handleClick} style={{background: opened ? "linear-gradient(90deg, #282A2D 0%, transparent 100%)" : ""}}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="homeIcon">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <h1 className="homeText">Home</h1>
        {opened ? <div className="homeSelected" /> : null}
      </div>
    );
  }
}

const mapDispatchToProps = {
    setOpenedDM
}

export default connect(null, mapDispatchToProps)(withRouter(LPHome));
