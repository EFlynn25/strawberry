import React, { Fragment } from 'react';
import { Routes, Route } from "react-router-dom";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { connect } from 'react-redux';
import Div100vh from 'react-div-100vh';

import './App.css';
import {
  setAppState,
} from './redux/appReducer';

import Overlay from './App/Overlay';
import TopBar from './App/TopBar';
import LeftPanel from './App/LeftPanel';
import MainPanel from './App/MainPanel';
import { ReactComponent as Menu } from './assets/icons/menu.svg';
import { ReactComponent as Close } from './assets/icons/close.svg';
import { startSocket } from './socket.js';
import withRouter from "./GlobalComponents/withRouter.js";

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
      popouts: []
    };

    this.checkMobile = this.checkMobile.bind(this);
    this.changePopout = this.changePopout.bind(this);

    window.addEventListener("resize", this.checkMobile);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.props.router.navigate("/welcome");
      } else {
        startSocket();
        let picture = user.photoURL
        if (picture == null) {
          picture = "/assets/images/default_profile_pic.png"; // Set default PFP
        }
        this.props.setAppState({ email: user.email, name: user.displayName, picture: picture });
      }
    });

    this.checkMobile();
  }

  componentDidUpdate() {
    if (!this.state.pageLoaded && this.props.dmsLoaded && this.props.groupsLoaded && this.props.peopleLoaded && this.props.socket == true) {
      // All backend data loaded, ready to close overlay and navigate home
      if (this.props.router.location.pathname == "/") {
        this.props.router.navigate("/home");
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
    if (this.updater.isMounted(this)) {
      if (window.innerWidth <= 880 && !this.props.mobile) {
        this.props.setAppState({ mobile: true });
      } else if (window.innerWidth > 880 && this.props.mobile) {
        this.props.setAppState({ mobile: false });
      }
    }
  }

  changePopout(data, add=true) {
    let newArray = this.state.popouts;
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

    this.setState({popouts: newArray});
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

          <Routes>
            <Route path="/welcome" element={<Overlay type="welcome" />} />
            <Route path="*" element={
              <Fragment>
                {  this.state.pageLoaded ?

                  <Fragment>
                    { this.props.mobile != true ? null :
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
                      popouts={this.props.mobile ? [] : this.state.popouts}
                      changePopout={this.changePopout} />
                  </Fragment>

                  :

                  null
                }

                <Overlay type="loading" hide={this.state.pageLoaded} socket={this.props.socket} multipleTabs={this.props.multipleTabs} dmsLoaded={this.props.dmsLoaded} groupsLoaded={this.props.groupsLoaded} peopleLoaded={this.props.peopleLoaded} />
              </Fragment>
            } />
          </Routes>
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
  notificationCount: state.app.notificationCount,
  mobile: state.app.mobile
});

const mapDispatchToProps = {
  setAppState,
}

//export default withRouter(App);
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
