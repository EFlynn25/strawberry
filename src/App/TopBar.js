import wlogo from '../swhite.svg';
import everett from '../assets/images/everett.jpeg';
import './TopBar.css';

import Image from 'react-image-resizer';

function TopBar() {
  return (
    <div className="TopBar">
      {/* Left side */}
      <img src={everett} className="mainPFP" alt="Profile picture" />
      <h1 className="welcomeText">Hey, Everett Flynn!</h1>

      {/* Right side */}
      <img src={wlogo} className="logo" alt="Strawberry logo" />
    </div>
  );
}

export default TopBar;
