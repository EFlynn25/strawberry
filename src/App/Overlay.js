import { Fragment } from 'react';
import { useHistory } from "react-router-dom";
import firebase from 'firebase/app';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

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
    //const mainPage = () =>

    firebase.auth().onAuthStateChanged(user => {
      if (!!user) {
        //mainPage();
        history.push('/');
      }
    });
    overlayContent =
      <div className="overlayPanel">
        {/*<img src={wlogo} className="oWelcomeLogo" alt="Strawberry logo" />*/}
        <SLogo className="oLoadingIcon" />
        <h1 className="oWelcomeText">Looks like you're not signed in.</h1>
        <div className="oWelcomeFirebaseDiv">
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      </div>;
  } else if (props.type == "loading") {
    /*overlayContent =
      <div className="overlayPanel">
        <h1 className="oLoadingText">Loading...</h1>
      </div>;*/
      if (props.hide != null && props.hide) {
        ovClass = "OverlayView OverlayViewHide";
      }
      showBg = false;
      overlayContent = (
        <div className="overlayLoading">
          {/*<img src={wlogo} className="oLoadingIcon" alt="Strawberry logo" />*/}
          <SLogo className="oLoadingIcon" />
          <h1 className={props.socket == false ? "oLoadingText" : "oLoadingText oLoadingTextHide"}>An error occurred<br/>(server did not respond)</h1>
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
