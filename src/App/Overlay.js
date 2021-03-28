import { Fragment } from 'react';
import { useHistory } from "react-router-dom";
import firebase from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Line } from 'rc-progress';

// import wlogo from '../assets/icons/swhite.svg';
import { ReactComponent as SLogo } from '../assets/icons/strawberry.svg';
import './Overlay.css';
import { uiConfig, signedIn } from '../StartFirebase'

import OTopBar from './Overlay/OTopBar';
import OLeftPanel from './Overlay/OLeftPanel';
import OMainPanel from './Overlay/OMainPanel';
import ORightPanel from './Overlay/ORightPanel';

function Overlay(props) {
  const history = useHistory();

  let ovClass = "OverlayView";
  let overlayContent;
  let showBg = true;
  if (props.type == "welcome") {
    firebase.auth().onAuthStateChanged(user => {
      if (!!user) {
        history.push('/');
      }
    });

    // SET CURRENTPAGE

    overlayContent =
      <div className="overlayPanel">
        <SLogo className="oWelcomeLogo" />
        <h1 className="oWelcomeText">Looks like you're not signed in.</h1>
        <div className="oWelcomeFirebaseDiv">
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      </div>;
  } else if (props.type == "loading") {
      if (props.hide != null && props.hide) {
        ovClass = "OverlayView OverlayViewHide";
      }
      showBg = false;
      var myProgress = "";
      var hideProgress = false;
      var step = 0;
      if (props.socket == null) {
        myProgress = "Connecting to server...";
      } else if (props.dmsLoaded == false) {
        step = 1;
        myProgress = "Loading DMs...";
      } else if (props.peopleLoaded == false) {
        step = 2;
        myProgress = "Loading people...";
      } else {
        step = 3;
      }
      if (props.socket == false) {
        myProgress = "Connecting to server...";
        hideProgress = true;
      }
      var percent = 0;
      var color = "#FAA";
      if (step == 1) {
        percent = 33;
        color = "#D88";
      } else if (step == 2) {
        percent = 66;
        color = "#A55";
      } else if (step == 3) {
        percent = 100;
        color = "#833";
      }

      overlayContent = (
        <div className="overlayLoading">
          <SLogo className="oLoadingIcon" />
          <h1 className={props.socket == false ? "oLoadingText" : "oLoadingText oLoadingHide"}>An error occurred<br/>(server connection closed)</h1>
          <h1 className={props.socket == false ? "oLoadingText oltLoading oLoadingHide" : "oLoadingText oltLoading"}>Loading...</h1>
          <Line className={hideProgress ? "olProgressBar oLoadingHide" : "olProgressBar"} percent={percent} strokeWidth="1" strokeColor={color} />
          <h1 className={hideProgress ? "oLoadingText oltProgress oLoadingHide" : "oLoadingText oltProgress"}>{myProgress}</h1>
        </div>
      );
  } else if (props.type == "blur") {
    if (props.hide != null && props.hide) {
      ovClass = "OverlayView OverlayViewHide";
    }
    showBg = false;
    overlayContent = null;
  }

  return (
    <div className={ovClass}>
      {
        showBg ?

        <Fragment>
          <OTopBar />
          <OLeftPanel />
          <OMainPanel />
          <ORightPanel />
        </Fragment>

        :

        null
      }
      <div className="overlay">
        {overlayContent}
      </div>
    </div>
  );
}

export default Overlay;
