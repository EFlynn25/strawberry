import React, { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';

import './HPAnnouncements.css';
import { ReactComponent as Close } from '../../../../assets/icons/close.svg';

class HPAnnouncements extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAnnouncement: false,
      openedAnnouncement: ""
    };
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

  render() {
    let announcementsList = [];
    let announcementChild = null;

    const reverseKeys = Object.keys(this.props.announcements).reverse();
    reverseKeys.forEach(item => {
      const title = this.props.announcements[item].title;
      const content = this.props.announcements[item].content;
      announcementsList.push(
        <div key={title} className="aliDiv" onClick={() => {this.setState({showAnnouncement: true, openedAnnouncement: item})}}>
          <h1 className="aliTitle">{title}</h1>
          <ReactMarkdown className="aliPreview">{content}</ReactMarkdown>
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
        <div className={this.state.showAnnouncement == "" ? "AAnnouncementsList" : "AAnnouncementsList AAnnouncementsListHide"}>
          <h1 className="announcementsTitle">Announcements</h1>
          <div className="announcements">
            { announcementsList }
          </div>
        </div>
        <div className={this.state.showAnnouncement == "" ? "AAnnouncement AAnnouncementHide" : "AAnnouncement"}>
          { announcementChild }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  announcements: state.app.announcements,
  announcementsRead: state.app.announcementsRead
});

export default connect(mapStateToProps, null)(HPAnnouncements);
