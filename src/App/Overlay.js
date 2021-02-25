import { useHistory } from "react-router-dom";
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import './Overlay.css';
import wlogo from '../assets/icons/swhite.svg';
import { uiConfig, signedIn } from '../StartFirebase'

import OTopBar from './Overlay/OTopBar';
import OLeftPanel from './Overlay/OLeftPanel';
import OMainPanel from './Overlay/OMainPanel';
import ORightPanel from './Overlay/ORightPanel';

function Overlay(props) {
  const history = useHistory();

  let overlayContent;
  if (props.type == "welcome") {
    const mainPage = () => history.push('/');

    firebase.auth().onAuthStateChanged(user => {
      if (!!user) {
        mainPage();
      }
    });
    overlayContent =
      <div className="overlayPanel">
        <img src={wlogo} className="oWelcomeLogo" alt="Strawberry logo" />
        <h1 className="oWelcomeText">Looks like you're not signed in.</h1>
        <div className="oWelcomeFirebaseDiv">
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      </div>;
  } else if (props.type == "loading") {
  overlayContent =
    <div className="overlayPanel">
      <h1 className="oLoadingText">Loading...</h1>
    </div>;
  }

  return (
    <div className="OverlayView">
      <OTopBar />
      <OLeftPanel />
      <OMainPanel />
      <ORightPanel />
      <div className="overlay">
        {overlayContent}
      </div>
    </div>
  );
}

export default Overlay;
