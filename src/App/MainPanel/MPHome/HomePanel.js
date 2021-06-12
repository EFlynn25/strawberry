import React from 'react';
import { connect } from 'react-redux';

import './HomePanel.css';
import HPUserProfile from './HomePanel/HPUserProfile';
import HPAnnouncements from './HomePanel/HPAnnouncements';

class HomePanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mainClasses: "HomePanel HomePanelHide",
      type: "",
      data: ""
    };

    this.panelRef = React.createRef();

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    this.reloadData();
    document.addEventListener('mouseup', this.handleClickOutside);
  }

  componentDidUpdate() {
    this.reloadData();
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleClickOutside);
  }

  reloadData() {
    let newClasses = this.state.mainClasses;
    let newType = this.state.type;
    let newData = this.state.data;
    if (this.props.type == "") {
      newClasses = "HomePanel HomePanelHide";
    } else {
      newClasses = "HomePanel";
      newType = this.props.type;
      newData = this.props.data;
    }

    if (this.state.mainClasses != newClasses || this.state.type != newType || this.state.data != newData) {
      this.setState({ mainClasses: newClasses, type: newType, data: newData});
    }
  }

  handleClickOutside(event) {
    if (this.panelRef && !this.panelRef.contains(event.target) && this.props.email != "") {
      this.props.onclose();
    }
  }

  setWrapperRef(node) {
    if (node != null) {
      this.panelRef = node;
    }
  }

  render() {
    let child = null;
    if (this.state.type == "profile") {
      child = <HPUserProfile email={this.state.data} />;
    } else if (this.state.type == "announcements") {
      child = <HPAnnouncements />
    } else {
      child = (
        <div style={{display: "table", width: "100%", height: "100%"}}>
          <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px"}}>
            {this.state.type}
            {this.state.data != "" ? <h1 style={{fontSize: "18px", color: "#fff3"}}>({this.state.data})</h1> : null}
          </h1>
        </div>
      );
    }

    return (
      <div className={this.state.mainClasses}>
        <div className={this.state.mainClasses == "HomePanel" ? "mainPanel" : "mainPanel mainPanelHide"} ref={this.setWrapperRef}>
          { child }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  announcements: state.app.announcements,
  announcementsRead: state.app.announcementsRead
});

export default connect(mapStateToProps, null)(HomePanel);
