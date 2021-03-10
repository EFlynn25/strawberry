import React, { Fragment, useEffect, useState } from 'react';
import { Switch, Route, withRouter } from "react-router-dom";
import firebase from 'firebase/app';
import 'firebase/auth';
import { connect } from 'react-redux';

import './App.css';
import {
  setUserName,
  setUserEmail,
  setUserPicture
} from './redux/userReducer';

import Overlay from './App/Overlay';
import TopBar from './App/TopBar';
import LeftPanel from './App/LeftPanel';
import MainPanel from './App/MainPanel';
import RightPanel from './App/RightPanel';
import { startSocket, add_user } from './socket.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLoaded: false
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.props.history.push("/welcome");
      } else {
        if (this.props.history.location.pathname == "/") {
          this.props.history.push("/home");
        }
        startSocket();
        this.props.setUserName(user.displayName);
        this.props.setUserEmail(user.email);
        this.props.setUserPicture(user.photoURL);
      }
    });
  }

  componentDidUpdate() {
    if (this.props.history.location.pathname == "/") {
      this.props.history.push("/home");
    }

    if (!this.state.pageLoaded && this.props.dmsLoaded) {
      this.setState({
        pageLoaded: true
      });
    }
  }

  render() {
    return (
      <div className="App">
          <Switch>
            <Route path="/welcome">
              <Overlay type="welcome" />
            </Route>
            <Route path="/">
              {  this.state.pageLoaded ?
                <Fragment>
                  <TopBar />
                  <LeftPanel />
                  <MainPanel />
                  {this.props.hideRightPanel ? null : <RightPanel />}
                </Fragment>

                :

                null
              }

              <Overlay type="loading" hide={this.state.pageLoaded} />
              {/*
              <TopBar />
              <LeftPanel />
              <MainPanel />
              {this.props.hideRightPanel ? null : <RightPanel />}
              <Overlay type="loading" hide={this.state.pageLoaded} />
              */}
            </Route>
          </Switch>

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.user.name,
  email: state.user.email,
  picture: state.user.picture,
  hideRightPanel: state.user.hideRightPanel,
  dmsLoaded: state.user.dmsLoaded
});

const mapDispatchToProps = {
    setUserName,
    setUserEmail,
    setUserPicture
}

//export default withRouter(App);
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
