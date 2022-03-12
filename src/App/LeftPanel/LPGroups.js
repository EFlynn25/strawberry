import React from 'react';
import { connect } from 'react-redux';
import equal from 'fast-deep-equal/react';

import './LPGroups.css';
import withRouter from "../../GlobalComponents/withRouter.js";
import { setAppState } from '../../redux/appReducer';
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
  }

  componentDidMount() {
    this.reloadThreads();
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.threads, prevProps.threads) || this.props.openedThread != prevProps.openedThread) {
      this.reloadThreads();
    }
  }

  reloadThreads() {
    let unreadThreads = 0;

    const noMessageThreads = [];
    const threads = this.props.threads;
    const myEmail = this.props.email;
    let threadTimestampList = Object.keys(threads).filter(function(key) {
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
      this.props.setList("groups", threadKeys);
      threadKeys.forEach(item => {
        const threadElement = <GroupsThread
                                key={"id" + item}
                                threadID={item}
                                thisThread={this.props.threads[item]}
                                hideLeftPanel={this.props.hideLeftPanel}
                                changePopout={this.props.changePopout}
                                opened={this.props.openedThread == item} />;
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

    this.props.setAppState({ "notificationCount.groups": unreadThreads });
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
  openedThread: state.groups.openedThread,
  threads: state.groups.threads,
  email: state.app.email,
  notificationCount: state.app.notificationCount,
});

const mapDispatchToProps = {
  setOpenedThread,
  setAppState
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LPGroups));
