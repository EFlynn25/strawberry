import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import './HPUserProfile.css';
import { getUser } from '../../../../GlobalComponents/getUser.js';

class HPUserProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const item = this.props.email;
    const myPerson = getUser(item);
    const name = myPerson.name;
    const picture = myPerson.picture;
    const status = myPerson.status;

    return (
      <div className="HPUserProfile">
        <div className="ppLeft">
          <img src={picture.split("=")[0]} className="pplPFP" alt={name} />
          <h1 className="pplName">{name}</h1>
          <p className="pplStatus" title={status}>{status}</p>
        </div>
        <div className="ppRight">
          <div key="id_no_posts" style={{display: "table", width: "100%", height: "100%"}}>
            <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px"}}>No posts</h1>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  knownPeople: state.people.knownPeople
});

export default connect(mapStateToProps, null)(HPUserProfile);
