import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import './HPSettings.css';

class HPSettings extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="HPSettings">
        <div style={{display: "flex", width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <h1 style={{margin: "0", color: "#fff5", fontSize: "18px"}}>Settings</h1>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, null)(HPSettings);
