import React from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';

import './HomeNotifications.css';
import { getUser } from '../../../GlobalComponents/getUser.js';
import { parseDate } from '../../../GlobalComponents/parseDate.js';
import { ReactComponent as Close } from '../../../assets/icons/close.svg';
import { ReactComponent as Done } from '../../../assets/icons/done.svg';
import { ReactComponent as ChatOutline } from '../../../assets/icons/chat_bubble_outline.svg';
import { ReactComponent as ForumOutline } from '../../../assets/icons/forum_outline.svg';
import { dms_request_to_chat, dms_deny_request, groups_join_thread, groups_deny_request, set_announcement_read } from '../../../socket.js';

class HomeNotifications extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const dmsRequestsExist = this.props.dms_requests.length > 0;
    const groupsRequestsExist = Object.keys(this.props.groups_requests).length > 0;
    const notReadWelcome = Object.keys(this.props.announcements).includes("welcome") && !this.props.announcementsRead.includes("welcome");

    return (
      <div className={this.props.classes}>

        { dmsRequestsExist || groupsRequestsExist ?
          <div className="hnCategory">
            <div className="hnCategoryHeader">
              <h1 className="hnCategoryTitle">REQUESTS</h1>
              <div className="hnCategoryLine"></div>
            </div>
            {
              this.props.dms_requests.map((item) => {
                const myUser = getUser(item);
                return (
                  <div className="hnCategoryContentDiv hnRequestDiv" key={item}>
                    <ChatOutline className="hnRequestTypeIcon" style={{fill: "#1540C2"}} />
                    <img src={myUser.picture} />
                    <h1>{myUser.name}</h1>
                    <p>has a requested a chat with you.</p>
                    <Done className="hwTopRightIcon hnAcceptIcon" onClick={() => dms_request_to_chat(item)} />
                    <Close className="hwTopRightIcon hnDeclineIcon" onClick={() => dms_deny_request(item)} />
                  </div>
                );
              })
            }
            {
              Object.keys(this.props.groups_requests).map((item) => {
                // const myUser = getUser(item);
                const myThread = this.props.groups_requests[item];
                let name = myThread.name;

                let profilesDiv = null;
                if (myThread.people != null && myThread.people.length > 0) { // I hate this if statement. ~50 lines just for Groups images.
                  const person1 = getUser(myThread.people[0]);
                  const person2 = getUser(myThread.people[1]);
                  const person3 = getUser(myThread.people[2]);
                  const person4 = getUser(myThread.people[3]);

                  if (myThread.people.length == 1) {
                    profilesDiv = (
                      <div className="gtProfilesDiv">
                        <img src={person1.picture} className="gtpdPFP" alt={person1.name} />
                      </div>
                    );
                  } else if (myThread.people.length == 2) {
                    profilesDiv = (
                      <div className="gtProfilesDiv">
                        <img src={person1.picture} className="gtpdPFP gtpd2people1" alt={person1.name} />
                        <img src={person2.picture} className="gtpdPFP gtpd2people2" alt={person2.name} />
                      </div>
                    );
                  } else if (myThread.people.length == 3) {
                    profilesDiv = (
                      <div className="gtProfilesDiv">
                        <img src={person1.picture} className="gtpdPFP gtpd3people1" alt={person1.name} />
                        <img src={person2.picture} className="gtpdPFP gtpd3people2" alt={person2.name} />
                        <img src={person3.picture} className="gtpdPFP gtpd3people3" alt={person3.name} />
                      </div>
                    );
                  } else if (myThread.people.length == 4) {
                    profilesDiv = (
                      <div className="gtProfilesDiv">
                        <img src={person1.picture} className="gtpdPFP gtpd4people1" alt={person1.name} />
                        <img src={person2.picture} className="gtpdPFP gtpd4people2" alt={person2.name} />
                        <img src={person3.picture} className="gtpdPFP gtpd4people3" alt={person3.name} />
                        <img src={person4.picture} className="gtpdPFP gtpd4people4" alt={person4.name} />
                      </div>
                    );
                  } else if (myThread.people.length > 4) {
                    let numberOfExtra = myThread.people.length - 3;
                    profilesDiv = (
                      <div className="gtProfilesDiv">
                        <img src={person1.picture} className="gtpdPFP gtpd4people1" alt={person1.name} />
                        <img src={person2.picture} className="gtpdPFP gtpd4people2" alt={person2.name} />
                        <img src={person3.picture} className="gtpdPFP gtpd4people3" alt={person3.name} />
                        <div className="gtpdPFP gtpd4people4 gtpdExtraDiv" style={{background: "#18191B"}}>
                          <p className="gtpdExtraText" style={{position: "static", fontSize: "9px", color: "white"}}>+{numberOfExtra}</p>
                        </div>
                      </div>
                    );
                  }
                }

                return (
                  <div className="hnCategoryContentDiv hnRequestDiv" key={item}>
                    <ForumOutline className="hnRequestTypeIcon" style={{fill: "#1D9545"}} />
                    { profilesDiv }
                    <h1>{name}</h1>
                    <p>You have been requested to join this Thread.</p>
                    <Done className="hwTopRightIcon hnAcceptIcon" onClick={() => groups_join_thread(item)} />
                    <Close className="hwTopRightIcon hnDeclineIcon" onClick={() => groups_deny_request(item)} />
                  </div>
                );
              })
            }
          </div>
          : null
        }

        { notReadWelcome ?
          <div className="hnCategory">
            <div className="hnCategoryHeader">
              <h1 className="hnCategoryTitle">WELCOME</h1>
              <div className="hnCategoryLine"></div>
            </div>

            <div className="aliDiv" onClick={() => {this.props.opendialog("announcements", "welcome"); set_announcement_read(["welcome"]);}}>
              <h1 style={{color: "var(--accent-color)", marginLeft: "20px"}} className="aliTitle">{this.props.announcements.welcome.title}</h1>
              <ReactMarkdown className="aliPreview">{this.props.announcements.welcome.content}</ReactMarkdown>
              <p className="aliTimestamp">{parseDate(this.props.announcements.welcome.timestamp)}</p>
              <div style={{position: "absolute", background: "white", width: "10px", height: "10px", borderRadius: "15px", top: "20px"}}></div>
            </div>

          </div>
          : null
        }

        { dmsRequestsExist || groupsRequestsExist || notReadWelcome ? null :
          <div style={{display: "table", width: "100%", height: "100%"}}>
            <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px", userSelect: "none"}}>No notifications</h1>
          </div>
        }

      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  dms_requests: state.dms.requests,
  groups_requests: state.groups.requests,
  announcementsRead: state.app.announcementsRead,
  announcements: state.app.announcements
});

export default connect(mapStateToProps, null)(HomeNotifications);
