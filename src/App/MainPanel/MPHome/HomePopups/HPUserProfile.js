import React, { Fragment } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';

import './HPUserProfile.css';
import { ReactComponent as ThumbUp } from '../../../../assets/icons/thumb_up.svg';
import { ReactComponent as ThumbUpFilled } from '../../../../assets/icons/thumb_up_filled.svg';
import { get_posts, like_post } from '../../../../socket.js';
import { getUser } from '../../../../GlobalComponents/getUser.js';
import { parseDate } from '../../../../GlobalComponents/parseDate.js';

class HPUserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.postListRef = React.createRef()

    this.loadMorePosts = this.loadMorePosts.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
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
    const myPerson = getUser(this.props.email);
    if (myPerson.posts != null && myPerson.posts.length > 0) {
      const containsFirstPost = myPerson.posts.some(item => item.post_id == myPerson.firstPost);
      if (!containsFirstPost) {
        get_posts(this.props.email, 5, myPerson.posts.length)
      }
    } else {
      get_posts(this.props.email, 5, 0)
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
    // let orderedPostList;

    const splitPic = picture.split("=")[0];
    if (splitPic != picture) {
      picture = splitPic + "=s150";
    }

    if (postsExist) {
      posts.sort((a, b) => b.timestamp - a.timestamp);
    }

    let postStatus = "No posts";
    if (posts == null) {
      postStatus = "Retrieving posts..."
    }

    return (
      <div className="HPUserProfile">
        <div className="ppLeft">
          <img src={picture} className="pplPFP" alt={name} />
          <h1 className="pplName">{name}</h1>
          <p className="pplStatus">{status}</p>
          { online ? <div className="pplOnline"></div> : null }
        </div>
        <div className="ppRight">
          <div className="pprPostList" ref={this.postListRef} onScroll={this.handleScroll}>
            <h3>Posts</h3>

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
                        <ThumbComponent className="pprPostThumbUp" onClick={() => like_post(item.post_id, !haveLikedPost)} />
                        <p>{item.likes}</p>
                      </div>
                      <p className="pprPostTimestamp">{parseDate(item.timestamp)}</p>
                    </div>
                  </div>
                )
              })
              : null
            }


            {
              postsExist ? null :
              <div key="id_no_posts" style={{display: "table", flex: "1"}}>
                <h1 style={{display: "table-cell", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px"}}>{postStatus}</h1>
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
  likedPosts: state.app.likedPosts
});

export default connect(mapStateToProps, null)(HPUserProfile);
