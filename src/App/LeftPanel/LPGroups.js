// import React from 'react';
//
// import './LPGroups.css';
//
// class LPGroups extends React.Component {
//   render() {
//     return (
//       <div className={this.props.mainClasses}>
//         <div style={{display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center"}}>
//           <h1 style={{color: "#fff5", fontSize: "16px"}}>No groups</h1>
//         </div>
//       </div>
//     );
//   }
// }
//
// export default LPGroups;








import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import './LPGroups.css';
import {
  setNotificationCount
} from '../../redux/appReducer';
import {
  setOpenedThread
} from "../../redux/groupsReducer"
import GroupsThread from './LPGroups/GroupsThread'
import GroupsNewThread from './LPGroups/GroupsNewThread'

class LPGroups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      faviconHref: "/favicon_package/favicon.ico",
      children: []
    };

    this.listOfEmails = [];

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    if (this.props.openedGroups != null) {
      this.props.history.push("/groups/" + this.props.openedGroups);
    }

    this.reloadThreads();

    // document.addEventListener("keydown", this.handleKeyDown);
  }

  componentDidUpdate(prevProps) {
    if (this.props.threads != prevProps.threads) {
      this.reloadThreads();
    }
  }

  componentWillUnmount() {
    // document.removeEventListener("keydown", this.handleKeyDown);
  }

  reloadThreads() {
    // let children = [];
    let unreadThreads = 0;

    const noMessageThreads = [];
    const threads = JSON.parse(JSON.stringify(this.props.threads));
    const myEmail = this.props.email;
    var threadTimestampList = Object.keys(threads).filter(function(key) {
      const thisThread = threads[key];
      const thisThreadMessages = thisThread.messages;
      if (thisThreadMessages == null || thisThreadMessages.length == 0) {
        noMessageThreads.push(key);
        return false;
      } else {
        if (thisThreadMessages[thisThreadMessages.length - 1].id > thisThread.lastRead[myEmail] || thisThread.lastRead[myEmail] == null) {
          unreadThreads++;
        }
      }
      return true;
    }).map(function(key) {
      const thisThreadMessages = threads[key].messages;
      return [key, thisThreadMessages[thisThreadMessages.length - 1].timestamp];
    });
    noMessageThreads.forEach(function (item, index) {
      const thisThread = threads[item];
      threadTimestampList.push([item, thisThread.created]);
    });

    threadTimestampList.sort(function(first, second) {
      return second[1] - first[1];
    });
    const threadKeys = threadTimestampList.map(function(x) {
        return x[0];
    });
    let newChildren = null;
    if (Array.isArray(threadKeys) && threadKeys.length) {
      newChildren = [];
      this.listOfEmails = threadKeys;
      threadKeys.map(item => {
        const threadElement = <GroupsThread key={"id" + item} threadID={item} />;
        newChildren.push(threadElement);
      });
    } else {
      newChildren = (
        <div key="id_no_threads" style={{display: "flex", width: "100%", height: "calc(100% + 20px)", alignItems: "center", justifyContent: "center"}}>
          <h1 style={{margin: "0", color: "#fff5", fontSize: "16px"}}>No threads</h1>
        </div>
      );
    }
    this.setState({
      children: newChildren
    });

    this.props.setNotificationCount({type: "groups", count: unreadThreads});
  }

  handleKeyDown(e) {
    if (e.ctrlKey && e.which === 38) {
      e.preventDefault();
      e.stopPropagation();

      if (!this.props.history.location.pathname.startsWith("/home")) {
        // const listOfChildrenEmails = this.state.children.map(child => child.props.threadEmail);
        // const myIndex = listOfChildrenEmails.indexOf(this.props.openedGroups);

        const myIndex = this.listOfEmails.indexOf(this.props.openedGroups);

        if (myIndex != 0) {
          // const newThread = listOfChildrenEmails[myIndex - 1];

          const newThread = this.listOfEmails[myIndex - 1];
          this.props.setOpenedThread(newThread);
          this.props.history.push("/groups/" + newThread);
        } else {
          this.props.history.push("/home");
        }
      }

    } else if (e.ctrlKey && e.which === 40) {
      e.preventDefault();
      e.stopPropagation();

      // const listOfChildrenEmails = this.state.children.map(child => child.props.threadEmail);
      if (this.props.history.location.pathname.startsWith("/home")) {
        // const newThread = listOfChildrenEmails[0];
        const newThread = this.listOfEmails[0];
        this.props.setOpenedThread(newThread);
        this.props.history.push("/groups/" + newThread);
      } else {
        // const myIndex = listOfChildrenEmails.indexOf(this.props.openedGroups);

        const myIndex = this.listOfEmails.indexOf(this.props.openedGroups);

        if (myIndex != this.listOfEmails.length - 1) {
        // if (myIndex != listOfChildrenEmails.length - 1) {
          // const newThread = listOfChildrenEmails[myIndex + 1];

          const newThread = this.listOfEmails[myIndex + 1];
          this.props.setOpenedThread(newThread);
          this.props.history.push("/groups/" + newThread);
        }
      }

    }
  }

  render() {
    return (
      <div className={this.props.mainClasses}>
        <div className="lpgThreads" style={this.state.children.key == "id_no_threads" ? {overflow: "hidden"} : null}>
          { this.state.children }
        </div>
        <GroupsNewThread />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.app.email,
  openedGroups: state.groups.openedGroups,
  threads: state.groups.threads
});

const mapDispatchToProps = {
  setNotificationCount,
  setOpenedThread
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LPGroups));
