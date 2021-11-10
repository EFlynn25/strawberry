import React, { Fragment, useEffect, useState } from 'react';
import { Switch, Route, withRouter } from "react-router-dom";
import firebase from 'firebase/app';
import 'firebase/auth';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import './App.css';
import {
  setUserName,
  setUserEmail,
  setUserPicture
} from './redux/appReducer';

import Overlay from './App/Overlay';
import TopBar from './App/TopBar';
import LeftPanel from './App/LeftPanel';
import MainPanel from './App/MainPanel';
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
        startSocket();
        this.props.setUserName(user.displayName);
        this.props.setUserEmail(user.email);
        let picture = user.photoURL
        if (picture == null) {
          // picture = "https://drive.google.com/uc?id=1Veh7wpXzbjuHHXPBafyWQfSNZr3zUsf-";
          picture = "/assets/images/default_profile_pic.png";
        }
        this.props.setUserPicture(picture);
      }
    });
  }

  componentDidUpdate() {
    if (!this.state.pageLoaded && this.props.dmsLoaded && this.props.groupsLoaded && this.props.peopleLoaded && this.props.socket == true) {
      if (this.props.history.location.pathname == "/") {
        this.props.history.push("/home");
      }
      this.setState({
        pageLoaded: true
      });
    }

    if (this.state.pageLoaded && this.props.socket == false) {
      this.setState({
        pageLoaded: false
      });
    }
  }

  render() {
    var myTitle = "";
    var tnc = 0;
    var newHref = "/favicon_package/favicon.ico";
    const nc = this.props.notificationCount;
    Object.keys(nc).map(function(key) {
      tnc += nc[key];
    });
    if (tnc > 0) {
      myTitle = "(" + tnc + ") ";
      newHref = "/favicon_package/nfavicon.ico"
    }
    if (this.props.currentPage != "") {
      myTitle += this.props.currentPage + " - ";
    }
    myTitle += "Strawberry";

    const favicon = document.getElementById("favicon");
    favicon.href = newHref;

    document.title = myTitle;

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
              </Fragment>

              :

              null
            }

            <Overlay type="loading" hide={this.state.pageLoaded} socket={this.props.socket} multipleTabs={this.props.multipleTabs} dmsLoaded={this.props.dmsLoaded} groupsLoaded={this.props.groupsLoaded} peopleLoaded={this.props.peopleLoaded} />
          </Route>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.app.name,
  email: state.app.email,
  picture: state.app.picture,

  dmsLoaded: state.app.dmsLoaded,
  groupsLoaded: state.app.groupsLoaded,
  peopleLoaded: state.app.peopleLoaded,
  socket: state.app.socket,
  multipleTabs: state.app.multipleTabs,

  currentPage: state.app.currentPage,
  notificationCount: state.app.notificationCount
});

const mapDispatchToProps = {
    setUserName,
    setUserEmail,
    setUserPicture
}

//export default withRouter(App);
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
