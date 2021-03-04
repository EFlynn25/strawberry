import { useSelector, useDispatch } from 'react-redux';

import wlogo from '../assets/icons/swhite.svg';
import everett from '../assets/images/everett.jpeg';
import './TopBar.css';
import {
  getUserName,
  getUserEmail,
  getUserPicture
} from '../redux/userReducer';

import TBProfilePicture from './TopBar/TBProfilePicture';

function TopBar() {
  const name = useSelector(getUserName);
  const email = useSelector(getUserEmail);
  const picture = useSelector(getUserPicture);

  return (
    <div className="TopBar">
      {/* Left side */}
      {/*<img src={picture} className="mainPFP" alt="Profile picture" />*/}
      <TBProfilePicture src={picture} />
      <h1 className="welcomeText">Hey, {name}!</h1>

      {/* Right side */}
      <img src={wlogo} className="logo" alt="Strawberry logo" />
    </div>
  );
}

export default TopBar;
