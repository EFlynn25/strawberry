import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import './HPAnnouncements.css';

class HPAnnouncements extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let children = [];

    Object.keys(this.props.announcements).forEach(item => {
      children.push(
        <div className="announcementDiv">
          <h1 className="announcementTitle">{this.props.announcements[item].title}</h1>
        </div>
      );
    });


    return (
      <div className="HPAnnouncements">
        <h1 className="announcementsTitle">Announcements</h1>
        <div className="announcements">
          {children}
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
