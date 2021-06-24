import React from 'react';

import './HomeProfile.css';

class HomeProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.classes}>
        <div style={{display: "table", width: "100%", height: "100%"}}>
          <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px"}}>No profile</h1>
        </div>
      </div>
    );
  }
}

export default HomeProfile;
