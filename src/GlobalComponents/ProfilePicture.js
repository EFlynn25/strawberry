import React from 'react';

import "./ProfilePicture.css"
import { getUser } from "./getUser.js"

function ProfilePicture(props) {
  const email = props.email;
  const myUser = getUser(email);

  const picture = props.picture != null ? props.picture : myUser.picture;
  const name = props.name != null ? props.name : myUser.name;

  const title = props.showTitle != false ? name + " (" + email + ")" : null;

  let className = "profilePicture ";
  let onClick = null;
  if (props.opendialog != null) {
    className += "profilePictureSpecial "
    onClick = () => props.opendialog("profile", props.email, false);
  }
  if (props.className != null) {
    className += props.className
  }

  const style = props.style != null ? props.style : null;

  return (
    <img
      src={picture}
      alt={name}
      key={"key" in Object.keys(props) ? props.key : null}
      title={title}
      className={className}
      onClick={onClick}
      style={style} />
  );
}

export default ProfilePicture;
