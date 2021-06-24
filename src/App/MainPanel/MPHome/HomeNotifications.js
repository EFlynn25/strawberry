import React from 'react';

import './HomeNotifications.css';

class HomeNotifications extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.classes}>
        <div style={{display: "table", width: "100%", height: "100%"}}>
          <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px"}}>No notifications</h1>
        </div>
      </div>
    );
  }
}

export default HomeNotifications;
