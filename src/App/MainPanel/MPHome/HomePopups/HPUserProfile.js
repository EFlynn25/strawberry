import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import './HPUserProfile.css';

class HPUserProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const item = this.props.email;
    const name = this.props.knownPeople[item].name;
    const picture = this.props.knownPeople[item].picture;
    let status = "hi im " + name + " and this is my status";

    if (item == "everettflynn25@gmail.com") {
      status = "bogos binted?";
    } else if (item == "cherryman656@gmail.com") {
      status = "Use my other account: everettflynn25@gmail.com";
    } else if (item == "appleandroidtechmaker@gmail.com") {
      status = "This is my chat account.";
    } else if (item == "flynneverett@logoscharter.com") {
      status = "Me gusta el español.";
    } else if (item == "toastmaster9804@gmail.com") {
      status = "EverettPlayz is Gucciiii";
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
