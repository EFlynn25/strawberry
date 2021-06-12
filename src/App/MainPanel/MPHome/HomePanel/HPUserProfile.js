import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import './HPUserProfile.css';

class HPUserProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const name = this.props.knownPeople[this.props.email].name;
    const picture = this.props.knownPeople[this.props.email].picture;
    let status = "hi im " + name + " and this is my status";

    if (this.props.email == "everettflynn25@gmail.com") {
      status = "officially done with school, coding time.";
    } else if (this.props.email == "cherryman656@gmail.com") {
      status = "Use my other account: everettflynn25@gmail.com";
    } else if (this.props.email == "appleandroidtechmaker@gmail.com") {
      status = "This is my chat account.";
    } else if (this.props.email == "flynneverett@logoscharter.com") {
      status = "Me gusta el español.";
    }

    return (
      <div className="HPUserProfile">
        <div className="ppLeft">
          <img src={picture} className="pplPFP" alt={name} />
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
