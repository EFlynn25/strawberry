import React, { Fragment } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import Loader from "react-loader-spinner";

import './HomeProfile.css';
import { ReactComponent as Edit } from '../../../assets/icons/edit.svg';
import { ReactComponent as Close } from '../../../assets/icons/close.svg';
import { ReactComponent as ThumbUp } from '../../../assets/icons/thumb_up.svg';
import { ReactComponent as Delete } from '../../../assets/icons/delete.svg';
import { set_status, get_posts, add_post, edit_post, delete_post } from '../../../socket.js';
import { setUserLoadingPosts } from '../../../redux/appReducer.js';
import { parseDate } from '../../../GlobalComponents/parseDate.js';

class HomeProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      statusInputVal: this.props.status,
      editingStatus: false,
      newPostVal: "",
      editingPost: "",
      editingPostVal: ""
    };

    this.statusInputRef = React.createRef();
    this.postListRef = React.createRef();
    this.editPostInputRef = React.createRef();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.inputEnterPressed = this.inputEnterPressed.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.loadMorePosts = this.loadMorePosts.bind(this);
    this.editPostButton = this.editPostButton.bind(this);
  }

  handleInputChange(event) {
    if (event.target.getAttribute("class") == "hpStatusInput") {
      if (this.state.editingStatus) {
        this.setState({statusInputVal: event.target.value})
      }
    } else if (event.target.getAttribute("class") == "hpPostInput") {
      this.setState({newPostVal: event.target.value})
    } else if (event.target.getAttribute("class") == "hpEditPostInput") {
      this.setState({editingPostVal: event.target.value})
    }
  }

  inputEnterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13 && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();

      if (event.target.getAttribute("class") == "hpStatusInput") {
        if (this.state.statusInputVal != this.props.status) { // I don't want more requests to the server than I need
          set_status(this.state.statusInputVal);
        }
        this.setState({editingStatus: false});
      } else if (event.target.getAttribute("class") == "hpPostInput") {
        if (this.state.newPostVal != "") { // Make sure users don't send blank posts
          add_post(this.state.newPostVal)
          this.setState({newPostVal: ''})
        }
      } else if (event.target.getAttribute("class") == "hpEditPostInput") {
        if (this.state.editingPostVal != "") { // Make sure users don't edit their posts to make them blank...
          edit_post(this.state.editingPost, this.state.editingPostVal)
          this.setState({editingPost: '', editingPostVal: ''})
        }
      }
    } else if (code === 27) {
      if (event.target.getAttribute("class") == "hpEditPostInput") {
        this.setState({editingPost: '', editingPostVal: ''})
      }
    }
  }

  handleScroll() {
    if (this.postListRef.current.scrollTop == this.postListRef.current.scrollHeight - this.postListRef.current.clientHeight) {
      this.loadMorePosts();
    }
  }

  loadMorePosts() {
    if (!this.props.loadingPosts) {

      const containsFirstPost = this.props.posts.some(item => item.post_id == this.props.firstPost);
      if (!containsFirstPost) {
        this.props.setUserLoadingPosts({email: this.props.email, data: true})
        get_posts(this.props.email, 5, this.props.posts.length)
      }

    }
  }

  editPostButton(post_id, message="") {
    if (this.state.editingPost != post_id) {
      this.setState({editingPost: post_id, editingPostVal: message})
      setTimeout(() => {
        const inputValueLength = this.editPostInputRef.current.innerHTML.length;
        this.editPostInputRef.current.focus();
        this.editPostInputRef.current.setSelectionRange(inputValueLength, inputValueLength);
      }, 250)
    } else {
      this.setState({editingPost: ""})
    }
  }

  render() {
    let noStatus = false;
    let status = this.props.status;
    if (!status || status == "") {
      status = "No status";
      noStatus = true;
    }

    // This part enlarges the image, because Google automatically sets the image to 96x96
    let picture = this.props.picture;
    const splitPic = picture.split("=")[0];
    if (splitPic != picture) {
      picture = splitPic + "=s150";
    }

    const posts = JSON.parse(JSON.stringify(this.props.posts));
    let postsExist = posts != null && posts.length > 0 ? true : false;
    if (postsExist) {
      posts.sort((a, b) => b.timestamp - a.timestamp);
    }

    return (
      <div className={this.props.classes}>


        <div className="HPUserProfile">
          <div className="ppLeft">
            <img src={picture} className="pplPFP" alt={this.props.name} />
            <h1 className="pplName">{this.props.name}</h1>
            <p className="hpEditStatus">Edit status:</p>
            <p className="pplStatus" style={this.state.editingStatus ? {display: "none"} : noStatus ? {fontStyle: "normal", color: "#fff5"} : null}>{status}<Edit className="hpEditIcon hpeiStatus" onClick={() => {this.setState({editingStatus: true}); this.statusInputRef.current.focus(); this.statusInputRef.current.setSelectionRange(this.state.statusInputVal.length, this.state.statusInputVal.length);}} /></p>
            <div className={this.state.editingStatus ? "hpChangeStatusDiv" : "hpChangeStatusDiv hpChangeStatusDivHidden"}>
              <TextareaAutosize value={this.state.statusInputVal} className={this.state.editingStatus ? "hpStatusInput" : "hpStatusInput hpStatusInputHidden"} onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} ref={this.statusInputRef} maxLength={180} />
              <Close className="hpEditIcon hpCloseIcon" onClick={() => this.setState({statusInputVal: this.props.status, editingStatus: false})} />
            </div>
          </div>
          <div className="ppRight">
            <h3>Posts</h3>
            { this.props.loadingPosts ?
              <Loader className="pprPostLoading" type="Oval" color="var(--accent-color)" height={25} width={25} />
              : null
            }
            <div className="pprPostList" ref={this.postListRef} onScroll={this.handleScroll}>
              <TextareaAutosize value={this.state.newPostVal} className="hpPostInput" onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} placeholder="Create post here" maxLength={1000} />

              { postsExist ?
                posts.map((item) => {
                  return (
                    <Fragment key={item.post_id}>
                      { this.state.editingPost == item.post_id ?
                        <div style={{display: "flex", gap: "5px", marginTop: "18px"}}>
                          <p style={{paddingLeft: "10px", color: "#bbb", userSelect: "none"}}>Editing post...</p>
                          <Close className="pprPostAction" onClick={() => this.editPostButton(this.state.editingPost)} />
                        </div>
                        : null
                      }
                      <div className="pprPost" key={item.post_id} style={this.state.editingPost == item.post_id ? {marginTop: "3px"} : null}>
                        {
                          this.state.editingPost == item.post_id ?
                          <Fragment>
                            <TextareaAutosize
                              value={this.state.editingPostVal}
                              className="hpEditPostInput"
                              onChange={this.handleInputChange}
                              onKeyDown={this.inputEnterPressed}
                              placeholder="Create post here"
                              maxLength={1000}
                              ref={this.editPostInputRef} />
                          </Fragment>
                          :
                          <ReactMarkdown>{item.message}</ReactMarkdown>
                        }
                        <div className="pprPostBottom">
                          <div>
                            <ThumbUp className="hpPostAction" />
                            <p>{item.likes}</p>
                            <Edit className="pprPostAction" style={{marginLeft: "10px"}} onClick={() => this.editPostButton(item.post_id, item.message)} />
                            <Delete className="pprPostAction hpPostDeleteIcon" onClick={() => delete_post(item.post_id)} />
                          </div>
                          <p
                            className="pprPostTimestamp"
                            title={item.edited != null ? "Edited on " + parseDate(item.edited, "basic") : "Original post"} >
                            { item.edited != null ? <span>(edited)</span> : null }
                            { parseDate(item.timestamp) }
                          </p>
                        </div>
                      </div>
                    </Fragment>
                  )
                })
                : null
              }

              {
                postsExist ? null :
                <h1 style={{position: "absolute", width: "70px", top: "calc(50% - 10px)", left: "calc(50% - 45px)", textAlign: "center", color: "#fff5", fontSize: "16px", userSelect: "none"}}>No posts</h1>
              }
            </div>
          </div>
        </div>


      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.app.email,
  name: state.app.name,
  picture: state.app.picture,
  status: state.app.status,
  posts: state.app.posts,
  loadingPosts: state.app.loadingPosts,
  firstPost: state.app.firstPost,
});

const mapDispatchToProps = {
  setUserLoadingPosts
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeProfile);
