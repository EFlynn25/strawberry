import React from 'react';

import './LPGroups.css';

class LPGroups extends React.Component {
  render() {
    return (
      <div className={this.props.mainClasses}>
        {/*<div style={{display: "table", width: "100%", height: "100%"}}>
          <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px"}}>No groups</h1>
        </div>*/}
        <div style={{display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
          <h1 style={{color: "#fff5", fontSize: "16px"}}>No groups</h1>
        </div>
      </div>
    );
  }
}

export default LPGroups;
