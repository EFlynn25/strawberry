import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import './LPDMs.css';
import DMChat from './LPDMs/DMChat'

class LPDMs extends React.Component {
  componentDidMount() {
    // If dmsOpenedChat is not blank, set the URL to it
    if (this.props.dmsOpenedChat != "") {
      this.props.history.push("/dms/" + this.props.dmsOpenedChat);
    }
  }

  render() {
    return (
      <div className="LPDMs">
        <DMChat chatEmail={"ethanflynn2007@gmail.com"} />
        <DMChat chatEmail={"toastmaster9804@gmail.com"} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dmsOpenedChat: state.dms.dmsOpenedChat
});

export default connect(mapStateToProps, null)(withRouter(LPDMs));
