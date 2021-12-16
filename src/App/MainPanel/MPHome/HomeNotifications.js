import React from 'react';
import { connect } from 'react-redux';

import './HomeNotifications.css';
import { getUser } from '../../../GlobalComponents/getUser.js';
import { ReactComponent as Close } from '../../../assets/icons/close.svg';
import { ReactComponent as Done } from '../../../assets/icons/done.svg';
import { dms_request_to_chat, dms_deny_request } from '../../../socket.js';

class HomeNotifications extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const requestsExist = this.props.dms_requests.length > 0;

    return (
      <div className={this.props.classes}>

        { requestsExist ?
          <div className="hnCategory">
            <div className="hnCategoryHeader">
              <h1 className="hnCategoryTitle">REQUESTS</h1>
              <div className="hnCategoryLine"></div>
            </div>
            {
              this.props.dms_requests.map((item) => {
                const myUser = getUser(item);
                return (
                  <div className="hnCategoryContentDiv hnRequestDiv">
                    <img src={myUser.picture} />
                    <h1>{myUser.name}</h1>
                    <p>has a requested a chat with you.</p>
                    <Done className="hwTopRightIcon" onClick={() => dms_request_to_chat(item)} />
                    <Close className="hwTopRightIcon" onClick={() => dms_deny_request(item)} />
                  </div>
                );
              })
            }
          </div>
          : null
        }

        { requestsExist ? null :
          <div style={{display: "table", width: "100%", height: "100%"}}>
            <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px"}}>No notifications</h1>
          </div>
        }

      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  dms_requests: state.dms.requests,
  groups_requests: state.groups.requests,
});

export default connect(mapStateToProps, null)(HomeNotifications);
