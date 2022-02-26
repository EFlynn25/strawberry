import React from 'react';
import { Switch, Route, withRouter } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import Loader from "react-loader-spinner";

import './HPUserProfile.css';
import { ReactComponent as AddPerson } from '../../../../assets/icons/add_person.svg';
import { ReactComponent as Join } from '../../../../assets/icons/join.svg';
import { ReactComponent as ThumbUp } from '../../../../assets/icons/thumb_up.svg';
import { ReactComponent as ThumbUpFilled } from '../../../../assets/icons/thumb_up_filled.svg';
import { get_posts, like_post, dms_request_to_chat } from '../../../../socket.js';
import { addLoadingPosts } from '../../../../redux/peopleReducer.js';
import { getUser } from '../../../../GlobalComponents/getUser.js';
import { parseDate } from '../../../../GlobalComponents/parseDate.js';

import ProfilePicture from '../../../../GlobalComponents/ProfilePicture';

class HPUserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      requesting: false
    };

    this.postListRef = React.createRef()

    this.handleScroll = this.handleScroll.bind(this);
    this.loadMorePosts = this.loadMorePosts.bind(this);
    this.addToDMs = this.addToDMs.bind(this);
  }

  componentDidMount() {
    const myPerson = getUser(this.props.email);
    if (myPerson.posts == null) {
      this.loadMorePosts();
    }
  }

  handleScroll() {
    if (this.postListRef.current.scrollTop == this.postListRef.current.scrollHeight - this.postListRef.current.clientHeight) {
      this.loadMorePosts();
    }
  }

  loadMorePosts() {
    if (!this.props.loadingPosts.includes(this.props.email)) {
      const myPerson = getUser(this.props.email);
      if (myPerson.posts != null && myPerson.posts.length > 0) { // User posts are loaded
        const containsFirstPost = myPerson.posts.some(item => item.post_id == myPerson.firstPost);
        if (!containsFirstPost) { // User posts don't contain first post; load more posts
          this.props.addLoadingPosts({email: this.props.email, data: true})
          get_posts(this.props.email, 10, myPerson.posts.length)
        }
      } else { // User posts are not loaded; load more posts
        this.props.addLoadingPosts({email: this.props.email, data: true})
        get_posts(this.props.email, 10, 0)
      }
    }
  }

  addToDMs() {
    this.setState({ requesting: true });

    const email = this.props.email;
    if (!this.props.dmsRequested.includes(email) && !Object.keys(this.props.chats).includes(email)) {
      dms_request_to_chat(email);
    }
  }

  render() {
    const item = this.props.email;
    const myPerson = getUser(item);
    const name = myPerson.name;
    let picture = myPerson.picture;
    const status = myPerson.status;
    const online = myPerson.online;
    const posts = JSON.parse(JSON.stringify(myPerson.posts));
    let postsExist = posts != null && posts.length > 0 ? true : false;

    const splitPic = picture.split("=")[0];
    if (splitPic != picture) {
      picture = splitPic + "=s140";
    }

    if (postsExist) {
      posts.sort((a, b) => b.timestamp - a.timestamp);
    }

    let postStatus = "No posts";
    if (posts == null) {
      postStatus = "Retrieving posts..."
    }

    let bottomAction;
    if (Object.keys(this.props.chats).includes(item)) {
      bottomAction = (
        <div className="pplBottomAction" onClick={() => { this.props.history.push("/dms/" + item); this.props.closedialog(); }}>
          <Join />
          <h1>Go to DM</h1>
        </div>
      );
    } else if (this.state.requesting || this.props.dmsRequested.includes(item)) {
      let text = "Requesting...";
      if (this.props.dmsRequested.includes(item)) {
        text = "Pending request...";
      }
      bottomAction = (
        <div className="pplBottomAction pplBottomActionStatus">
          <h1>{text}</h1>
        </div>
      );
    } else {
      bottomAction = (
        <div className="pplBottomAction pplBottomActionButton" onClick={this.addToDMs}>
          <AddPerson />
          <h1>Add to DMs</h1>
        </div>
      );
    }

    return ( // "pp" probably stands for "PersonProfile"... otherwise it would be "upLeft" for "UserProfile", which is confusing
      <div className="HPUserProfile">
        <div className="ppLeft">
          {/*<img src={picture} className="pplPFP" alt={name} />*/}
          <ProfilePicture
            email={item}
            picture={picture}
            className="pplPFP" />
          <h1 className="pplName">{name}</h1>
          <p className="pplStatus">{status}</p>
          { online ? <div className="pplOnline"></div> : null }
          { bottomAction }
        </div>
        <div className="ppRight">
          <h3>Posts</h3>
          { this.props.loadingPosts.includes(this.props.email) ?
            <Loader className="pprPostLoading" type="Oval" color="var(--accent-color)" height={25} width={25} />
            : null
          }
          <div className="pprPostList" ref={this.postListRef} onScroll={this.handleScroll}>

            { postsExist ?
              posts.map((item) => {
                let ThumbComponent = ThumbUp;
                let haveLikedPost = false;
                if (this.props.likedPosts.includes(item.post_id)) {
                  ThumbComponent = ThumbUpFilled;
                  haveLikedPost = true;
                }

                return (
                  <div className="pprPost" key={item.post_id}>
                    <ReactMarkdown>{item.message}</ReactMarkdown>
                    <div className="pprPostBottom">
                      <div>
                        <ThumbComponent className="pprPostAction" onClick={() => like_post(item.post_id, !haveLikedPost)} />
                        <p>{item.likes}</p>
                      </div>
                      <p
                        className="pprPostTimestamp"
                        title={item.edited != null ? "Edited on " + parseDate(item.edited, "basic") : "Original post"} >
                        { item.edited != null ? <span>(edited)</span> : null }
                        { parseDate(item.timestamp) }
                      </p>
                    </div>
                  </div>
                )
              })
              : null
            }

            {
              postsExist ? null :
              <div key="id_no_posts" style={{display: "table", width: "100%", height: "100%"}}>
                <h1 style={{display: "table-cell", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px", userSelect: "none"}}>{postStatus}</h1>
              </div>
            }

            {/*
              <div key="id_no_posts" style={{display: "table", width: "100%", height: "100%"}}>
                <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px"}}>No posts</h1>
              </div>
            */}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  knownPeople: state.people.knownPeople,
  chats: state.dms.chats,
  dmsRequested: state.dms.requested,
  loadingPosts: state.people.loadingPosts,
  likedPosts: state.app.likedPosts,
});

const mapDispatchToProps = {
  addLoadingPosts
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HPUserProfile));
