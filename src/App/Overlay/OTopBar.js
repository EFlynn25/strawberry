// import wlogo from '../../assets/icons/swhite.svg';
import { ReactComponent as SLogo } from '../../assets/icons/strawberry.svg';
import everett from '../../assets/images/everett.jpeg';
import './OTopBar.css';

import Image from 'react-image-resizer';

function OTopBar() {
  return (
    <div className="OTopBar">
      {/* Left side *
      <img src={everett} className="mainPFP" alt="Profile picture" />
      <h1 className="welcomeText">Hey, Everett Flynn!</h1>*/}

      {/* Right side *
      <img src={wlogo} className="logo" alt="Strawberry logo" />*/}
    </div>
  );
}

export default OTopBar;
