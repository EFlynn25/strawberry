import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from "react-router-dom";

import './MainPanel.css';
/*
import {
  dmsOpenedChat
} from '../redux/dmsReducer';
*/
//import ethan from "../assets/images/ethan.webp"
import MPDMs from './MainPanel/MPDMs'

class MainPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="MainPanel">
        <Switch>
          <Route path="/dms/:chatEmail" component={MPDMs} />
          <Route path="/dms">
            {/*<h1 style={{color: "white", margin: "10px", fontSize: "20px"}}>Thread ID: {this.props.dmsOpenedChat}</h1>*/}


          </Route>
          <Route path="/groups">
            <h1 style={{color: "white", margin: "10px", fontSize: "20px"}}>Groups lol</h1>
          </Route>
        </Switch>
      </div>
    );
  }
}
/*
const mapStateToProps = (state) => ({
  dmsOpenedChat: state.dms.dmsOpenedChat
});

export default connect(mapStateToProps, null)(MainPanel);
*/
export default MainPanel;
