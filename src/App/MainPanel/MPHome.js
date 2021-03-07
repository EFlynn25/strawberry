import React from 'react';
import { connect } from 'react-redux';

import './MPHome.css';
import {
  sethideRightPanel
} from '../../redux/userReducer';

class MPHome extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="MPHome">
        <div style={{display: "table", width: "100%", height: "100%"}}>
          <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "20px"}}>Strawberry Home</h1>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
    sethideRightPanel
}

export default connect(null, mapDispatchToProps)(MPHome);
