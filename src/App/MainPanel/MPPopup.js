import React from 'react';
import { connect } from 'react-redux';

import './MPPopup.css';
import HPUserProfile from './MPHome/HomePopups/HPUserProfile';
import HPAnnouncements from './MPHome/HomePopups/HPAnnouncements';
import HPSettings from './MPHome/HomePopups/HPSettings';
import GroupSettings from './MPGroups/MPGPopups/GroupSettings';

class MPPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mainClasses: "MPPopup MPPopupHide",
      type: "",
      data: ""
    };

    this.panelRef = React.createRef();

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.mousePressedDown = false; // Has the user already pressed down outside of the panel?
  }

  componentDidMount() {
    this.reloadData();
    document.addEventListener('mouseup', this.handleClickOutside);
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentDidUpdate() {
    this.reloadData();
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleClickOutside);
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  reloadData() {
    let newClasses = this.state.mainClasses;
    let newType = this.state.type;
    let newData = this.state.data;
    if (this.props.type == "") {
      newClasses = "MPPopup MPPopupHide";
      if (this.state.type != "") {
        setTimeout(function() { // Resets this.state.type AFTER panel is completely closed, for smoother transitions
          if (this.updater.isMounted(this)) {
            this.setState({ type: "" });
          }
        }.bind(this), 300);
      }
    } else {
      newClasses = "MPPopup";
      newType = this.props.type;
      newData = this.props.data;
    }

    if (this.state.mainClasses != newClasses || this.state.type != newType || this.state.data != newData) {
      this.setState({ mainClasses: newClasses, type: newType, data: newData});
    }
  }

  handleClickOutside(event) { // Checks if the user has pressed both down and up outside of the panel
    if (this.panelRef && !this.panelRef.contains(event.target) && this.props.type != "") {
      if (event.type == "mousedown") {
        this.mousePressedDown = true;
      } else if (event.type == "mouseup") {
        if (this.mousePressedDown) {
          this.props.onclose();
        }
      }
    }

    if (event.type == "mouseup") {
      this.mousePressedDown = false;
    }
  }

  setWrapperRef(node) {
    if (node != null) {
      this.panelRef = node;
    }
  }

  render() {
    let panelStyles = {};

    let child = null;
    if (this.state.type == "profile") {
      child = <HPUserProfile email={this.state.data} />;
    } else if (this.state.type == "announcements") {
      child = <HPAnnouncements openAnnouncement={this.state.data} />;
    } else if (this.state.type == "settings") {
      child = <HPSettings />;
    } else if (this.state.type == "groupSettings") {
      child = <GroupSettings myThreadID={this.state.data} closedialog={this.props.onclose} />;
      panelStyles.height = "100%";
      panelStyles.paddingTop = "unset";
    } else {
      child = (
        <div style={{display: "flex", width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <h1 style={{margin: "0", color: "#fff5", fontSize: "18px"}}>
            {this.state.type}
          </h1>
        </div>
      );
    }

    return (
      <div className={this.props.shrink ? this.state.mainClasses : this.state.mainClasses + " MPPopupNoShrink"}>
        <div className="mpDarkenBackground"></div>
        <div className={this.state.mainClasses == "MPPopup" ? "mainPanel" : "mainPanel mainPanelHide"} ref={this.setWrapperRef} style={panelStyles}>
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

export default connect(mapStateToProps, null)(MPPopup);
