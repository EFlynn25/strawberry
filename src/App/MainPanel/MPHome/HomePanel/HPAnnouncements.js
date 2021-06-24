import React, { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';

import './HPAnnouncements.css';
import { ReactComponent as Close } from '../../../../assets/icons/close.svg';
import { ReactComponent as Add } from '../../../../assets/icons/add.svg';
import { add_announcement, set_announcement_read } from '../../../../socket.js';

class HPAnnouncements extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAnnouncement: false,
      showAddAnnouncement: false,
      openedAnnouncement: "",
      aaTab: "write",
      aawValue: "",
      aapbText: "Post",
      aaphiTitleText: "",
      aaphiIDText: ""
    };

    this.markAllHandleClick = this.markAllHandleClick.bind(this);
    this.aawHandleChange = this.aawHandleChange.bind(this);
    this.aaTitleHandleChange = this.aaTitleHandleChange.bind(this);
    this.aaIDHandleChange = this.aaIDHandleChange.bind(this);
    this.aapbHandleClick = this.aapbHandleClick.bind(this);
    this.aapbMouseLeave = this.aapbMouseLeave.bind(this);
  }

  parseDate(timestamp) {
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(timestamp * 1000);

    let month = shortMonths[date.getMonth()];
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const fullString = month + ' ' + date.getDate() + ', ' + date.getFullYear() + ' • ' + hours + ':' + minutes + ' ' + ampm;

    return(fullString);
  }

  markAllHandleClick() {
    let idsList = [];
    const ar = this.props.announcementsRead;
    Object.keys(this.props.announcements).forEach(function(id) {
      if (!ar.includes(id)) {
        idsList.push(id);
      }
    });
    if (idsList.length > 0) {
      set_announcement_read(idsList);
    }
  }

  aawHandleChange(event) {
    this.setState({aawValue: event.target.value});
  }

  aaTitleHandleChange(event) {
    this.setState({aaphiTitleText: event.target.value});
  }

  aaIDHandleChange(event) {
    this.setState({aaphiIDText: event.target.value});
  }

  aapbHandleClick() {
    if (this.state.aapbText == "Post") {
      this.setState({
        aapbText: "Are you sure?"
      });
    } else if (this.state.aapbText == "Are you sure?") {
      this.setState({
        aapbText: "Posting..."
      });
      add_announcement(this.state.aaphiIDText, this.state.aaphiTitleText, this.state.aawValue);
    }
  }

  aapbMouseLeave() {
    if (this.state.aapbText != "Post") {
      this.setState({
        aapbText: "Post"
      });
    }
  }

  render() {
    let announcementsList = [];
    let announcementChild = null;

    const reverseKeys = Object.keys(this.props.announcements).reverse();
    reverseKeys.forEach(item => {
      const title = this.props.announcements[item].title;
      const content = this.props.announcements[item].content;
      announcementsList.push(
        <div key={item} className="aliDiv" onClick={() => {this.setState({showAnnouncement: true, openedAnnouncement: item}); if (!this.props.announcementsRead.includes(item)) set_announcement_read([item]);}}>
          <h1 style={this.props.announcementsRead.includes(item) ? null : {color: "var(--accent-color)", marginLeft: "20px"}} className="aliTitle">{title}</h1>
          <ReactMarkdown className="aliPreview">{content}</ReactMarkdown>
          <p className="aliTimestamp">{this.parseDate(this.props.announcements[item].timestamp)}</p>
          {this.props.announcementsRead.includes(item) ? null : <div style={{position: "absolute", background: "white", width: "10px", height: "10px", borderRadius: "15px", top: "20px"}}></div>}
        </div>
      );
    });

    const oa = this.state.openedAnnouncement;
    if (oa != "") {
      announcementChild = (
        <Fragment>
          <div className="announcementTopDiv">
            <Close className="announcementCloseIcon" onClick={() => {this.setState({showAnnouncement: false})}} />
            <h1 className="announcementTitle">{this.props.announcements[oa].title}</h1>
          </div>
          <ReactMarkdown className="announcementContent">{this.props.announcements[oa].content}</ReactMarkdown>
          <p className="announcementTimestamp">{this.parseDate(this.props.announcements[oa].timestamp)}</p>
        </Fragment>
      );
    }


    return (
      <div className="HPAnnouncements">
        <div className={this.state.showAnnouncement == false && this.state.showAddAnnouncement == false ? "AAnnouncementsList" : "AAnnouncementsList AAnnouncementsListHide"}>
          <h1 className="announcementsTitle">Announcements</h1>
          <div className="alActions">
            <h1 className="alMarkAll" onClick={this.markAllHandleClick}>Mark all as read</h1>
            {
              this.props.email == "everettflynn25@gmail.com" ?
              <Add className="alAdd" onClick={() => {this.setState({showAddAnnouncement: true})}} /> : null
            }
          </div>
          <div className="announcements">
            { announcementsList }
          </div>
        </div>
        <div className={this.state.showAnnouncement == true ? "AAnnouncement" : "AAnnouncement AAnnouncementHide"}>
          { announcementChild }
        </div>
        <div className={this.state.showAddAnnouncement == true ? "AAddAnnouncement" : "AAddAnnouncement AAddAnnouncementHide"}>
          <div className="announcementTopDiv">
            <Close className="addAnnouncementCloseIcon" onClick={() => {this.setState({showAddAnnouncement: false})}} />
            <h1 className="aaTitle">Add Announcement</h1>
          </div>
          <div className="announcementTopDiv">
            <input placeholder="Post ID" className="aaPostHeaderInput" value={this.state.aaphiIDText} onChange={this.aaIDHandleChange} />
            <input placeholder="Post Title" className="aaPostHeaderInput" value={this.state.aaphiTitleText} onChange={this.aaTitleHandleChange} style={{width: "250px"}} />
          </div>
          <div className="aaTabs">
            <div className={this.state.aaTab == "write" ? "aaTab aaTabSelected" : "aaTab"} onClick={() => {this.setState({aaTab: "write"})}}>
              <h1>Write</h1>
            </div>
            <div className={this.state.aaTab == "preview" ? "aaTab aaTabSelected" : "aaTab"} onClick={() => {this.setState({aaTab: "preview"})}}>
              <h1>Preview</h1>
            </div>
          </div>
          <textarea className={this.state.aaTab == "write" ? "aawInput" : "aawInput aaTabContentHide"} value={this.state.aawValue} onChange={this.aawHandleChange} />
          <div className={this.state.aaTab == "preview" ? "aapDiv" : "aapDiv aaTabContentHide"}>
            <ReactMarkdown>{this.state.aawValue}</ReactMarkdown>
          </div>
          <button className="aaPostButton" onClick={this.aapbHandleClick} onMouseLeave={this.aapbMouseLeave}>{this.state.aapbText}</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  announcements: state.app.announcements,
  announcementsRead: state.app.announcementsRead,
  email: state.app.email
});

export default connect(mapStateToProps, null)(HPAnnouncements);
