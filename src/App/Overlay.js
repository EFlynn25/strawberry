import { Fragment } from 'react';
import { useHistory } from "react-router-dom";
import firebase from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Line } from 'rc-progress';
import { useDispatch } from 'react-redux'
import { setAppState } from '../redux/appReducer';

// import wlogo from '../assets/icons/swhite.svg';
import { ReactComponent as SLogo } from '../assets/icons/strawberry.svg';
import './Overlay.css';
import { uiConfig } from '../StartFirebase'

function Overlay(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  let ovClass = "OverlayView";
  let overlayContent;
  let showBg = true;
  if (props.type == "welcome") { // Overlay has different types, for sign-in page, loading screen, and just blur (unused).
    firebase.auth().onAuthStateChanged(user => {
      if (!!user) {
        history.push('/');
      }
    });

    dispatch(setAppState({ currentPage: "Welcome" })); // Sets the title of the page to "Welcome - Strawberry" with App.js

    overlayContent =
      <div className="overlayPanel">
        <SLogo className="oWelcomeLogo" />
        <div className="oWelcomeTextDiv">
          <h1 className="oWelcomeText">Looks like you're not signed in.</h1>
        </div>
        <div className="oWelcomeFirebaseDiv">
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      </div>;
  } else if (props.type == "loading") {
      if (props.hide != null && props.hide) {
        ovClass = "OverlayView OverlayViewHide";
      }
      showBg = false;
      let myProgress = "";
      let hideProgress = false;
      let step = 0;
      if (props.socket == null) {
        myProgress = "Connecting to server...";
      } else if (props.dmsLoaded == false) {
        step = 1;
        myProgress = "Loading DMs...";
      } else if (props.groupsLoaded == false) {
        step = 2;
        myProgress = "Loading Groups...";
      } else if (props.peopleLoaded == false) {
        step = 3;
        myProgress = "Loading people...";
      } else {
        step = 4;
      }
      if (props.socket == false) {
        myProgress = "Connecting to server...";
        hideProgress = true;
      }
      if (props.multipleTabs == true) {
        hideProgress = true;
      }
      let percent = 0;
      let color = "#FAA";
      if (step == 1) {
        percent = 25;
        color = "#D88";
      } else if (step == 2) {
        percent = 50;
        color = "#A55";
      } else if (step == 3) {
        percent = 75;
        color = "#833";
      } else if (step == 4) {
        percent = 100;
        color = "#611";
      }

      overlayContent = (
        <div className="overlayLoading">
          <SLogo className="oLoadingIcon" />
          <h1 className={props.multipleTabs == true && props.socket == true ? "oLoadingText" : "oLoadingText oLoadingHide"} style={{width: "80%", padding: "0 10%", fontSize: "24px", color: "#F66"}}>You can only have one tab open at a time</h1>
          <h1 className={props.socket == false ? "oLoadingText" : "oLoadingText oLoadingHide"}>An error occurred<br/>(server connection closed)</h1>
          <h1 className={hideProgress ? "oLoadingText oltLoading oLoadingHide" : "oLoadingText oltLoading"}>Loading...</h1>
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
          <div className="OTopBar"></div>    {/* These panels are placeholders for the background of the sign-in page */}
          <div className="OLeftPanel"></div> {/* (The "O" stands for "Overlay") */}
          <div className="OMainPanel"></div>
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
