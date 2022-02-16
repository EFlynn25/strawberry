import React, { Fragment } from 'react';
import { Switch, Route, withRouter } from "react-router-dom";
import firebase from 'firebase/app';
import 'firebase/auth';
import { connect } from 'react-redux';
import Div100vh from 'react-div-100vh';

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
import { ReactComponent as Menu } from './assets/icons/menu.svg';
import { ReactComponent as Close } from './assets/icons/close.svg';
import { startSocket } from './socket.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLoaded: false,
      showLeftPanel: false,
      showCloseButton: false,
      mobile: false,
      chatPopouts: [],
      threadPopouts: [],
    };

    this.checkMobile = this.checkMobile.bind(this);
    this.changePopout = this.changePopout.bind(this);

    window.addEventListener("resize", this.checkMobile);
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
          picture = "/assets/images/default_profile_pic.png"; // Set default PFP
        }
        this.props.setUserPicture(picture);
      }
    });

    this.checkMobile();
  }

  componentDidUpdate() {
    if (!this.state.pageLoaded && this.props.dmsLoaded && this.props.groupsLoaded && this.props.peopleLoaded && this.props.socket == true) {
      // All backend data loaded, ready to close overlay and navigate home
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

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkMobile);
  }

  checkMobile() {
    if (window.innerWidth <= 880 && !this.state.mobile) {
      this.setState({ mobile: true });
    } else if (window.innerWidth > 880 && this.state.mobile) {
      this.setState({ mobile: false });
    }
  }

  changePopout(type, data, add=true) {
    const stateName = type + "Popouts";
    let newArray = this.state[stateName];
    if (add) {
      if (this.state.chatPopouts.length + this.state.threadPopouts.length < 5 && !newArray.includes(data)) {
        newArray.unshift(data);
      }
    } else {
      const index = newArray.indexOf(data);
      if (index > -1) {
        newArray.splice(index, 1);
      }
    }

    let stateObject = {}
    stateObject[stateName] = newArray;
    this.setState(stateObject);
  }

  render() {
    let myTitle = "";
    let tnc = 0; // Total notification count
    let newHref = "/favicon_package/favicon.ico";
    const nc = this.props.notificationCount;
    Object.keys(nc).forEach(function(key) {
      tnc += nc[key];
    });
    if (tnc > 0) { // Set favicon to unread and set title prefix
      myTitle = "(" + tnc + ") ";
      newHref = "/favicon_package/nfavicon.ico"
    }
    if (this.props.currentPage != "") { // If the current page is Home, DMs, etc., add it to the title
      myTitle += this.props.currentPage + " - ";
    }
    myTitle += "Strawberry";

    // Set favicon and title based on if statements before
    const favicon = document.getElementById("favicon");
    favicon.href = newHref;
    document.title = myTitle;

    let appHamburgerIconStyles = {};
    if (this.state.showCloseButton) {
      appHamburgerIconStyles.width = "70px"
    }
    if (this.state.showLeftPanel == true) {
      appHamburgerIconStyles.transform = "translateX(-41px)"
    }

    return (
      <Div100vh>
        <div className="App">

          <Switch>
            <Route path="/welcome">
              <Overlay type="welcome" />
            </Route>
            <Route path="/">
              {  this.state.pageLoaded ?

                <Fragment>
                  { this.state.mobile != true ? null :
                    <div className="appHamburgerIcon" style={appHamburgerIconStyles}>
                      <div className="ahiMenuTrigger" onClick={() => {this.setState({showLeftPanel: true})}}></div>
                      <Menu />
                      {this.state.showCloseButton ? <Close /> : null}
                    </div>
                  }
                  <TopBar showLeftPanel={this.state.showLeftPanel} hideLeftPanel={() => {this.setState({showLeftPanel: false})}} />
                  <LeftPanel
                    showLeftPanel={this.state.showLeftPanel} hideLeftPanel={() => {this.setState({showLeftPanel: false})}}
                    changePopout={this.changePopout} />
                  <MainPanel
                    setCloseButton={(value) => {this.setState({showCloseButton: value})} /* Shows close button when MPPopup is open */}
                    chatPopouts={this.state.chatPopouts}
                    threadPopouts={this.state.threadPopouts}
                    changePopout={this.changePopout} />
                </Fragment>

                :

                null
              }

              <Overlay type="loading" hide={this.state.pageLoaded} socket={this.props.socket} multipleTabs={this.props.multipleTabs} dmsLoaded={this.props.dmsLoaded} groupsLoaded={this.props.groupsLoaded} peopleLoaded={this.props.peopleLoaded} />
            </Route>
          </Switch>
        </div>
      </Div100vh>
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
