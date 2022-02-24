import React from 'react';

import "./ProfilePicture.css"
import { getUser } from "./getUser.js"

class ProfilePicture extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const email = this.props.email;
    const myUser = getUser(email);

    const picture = this.props.picture != null ? this.props.picture : myUser.picture;
    const name = this.props.name != null ? this.props.name : myUser.name;

    const title = this.props.showTitle != false ? name + " (" + email + ")" : null;

    let className = "profilePicture ";
    let onClick = null;
    if (this.props.opendialog != null) {
      className += "profilePictureSpecial "
      onClick = () => this.props.opendialog("profile", this.props.email, false);
    }
    if (this.props.className != null) {
      className += this.props.className
    }

    const style = this.props.style != null ? this.props.style : null;

    return (
      <img
        src={picture}
        alt={name}
        title={title}
        className={className}
        onClick={onClick}
        style={style} />
    );
  }
}

export default ProfilePicture;
