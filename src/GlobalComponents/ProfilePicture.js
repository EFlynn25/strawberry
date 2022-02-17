import React from 'react';

import "./ProfilePicture.css"
import { getUser } from "./getUser.js"

class ProfilePicture extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const myUser = getUser(this.props.email);
    const picture = this.props.picture != null ? this.props.picture : myUser.picture;
    const name = this.props.name != null ? this.props.name : myUser.name;
    let className = "profilePicture ";
    if (this.props.opendialog != null) {
      className += "profilePictureSpecial "
    }
    if (this.props.className != null) {
      className += this.props.className
    }
    const onClick = this.props.opendialog != null ? () => this.props.opendialog("profile", this.props.email, false) : null;
    const style = this.props.style != null ? this.props.style : null;

    return(
      <div className="ProfilePicture">
        <img
          src={picture}
          alt={name}
          className={className}
          onClick={onClick}
          style={style} />
      </div>
    )
  }
}

export default ProfilePicture;
