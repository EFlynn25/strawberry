import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { connect } from 'react-redux';

import './HomeProfile.css';
import { ReactComponent as Edit } from '../../../assets/icons/edit.svg';
import { ReactComponent as Close } from '../../../assets/icons/close.svg';
import { ReactComponent as ThumbUp } from '../../../assets/icons/thumb_up.svg';
import { ReactComponent as ThumbUpFilled } from '../../../assets/icons/thumb_up_filled.svg';
import { set_status } from '../../../socket.js';
import { parseDate } from '../../../GlobalComponents/parseDate.js';

class HomeProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      statusInputVal: this.props.status,
      editingStatus: false,
      newPostVal: ""
    };

    this.statusInputRef = React.createRef();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.inputEnterPressed = this.inputEnterPressed.bind(this);
  }

  handleInputChange(event) {
    if (event.target.getAttribute("class") == "hpStatusInput") {
      if (this.state.editingStatus) {
        this.setState({statusInputVal: event.target.value})
      }
    } else if (event.target.getAttribute("class") == "hpPostInput") {
      this.setState({newPostVal: event.target.value})
    }
  }

  inputEnterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      event.stopPropagation();

      if (event.target.getAttribute("class") == "hpStatusInput") {
        if (this.state.statusInputVal != this.props.status) {
          set_status(this.state.statusInputVal);
        }
        this.setState({editingStatus: false});
      } else if (event.target.getAttribute("class") == "hpPostInput") {
        this.setState({newPostVal: ''})
        //   <--- Add post here
      }
    }
  }

  render() {
    let noStatus = false;
    let status = this.props.status;
    if (!status || status == "") {
      status = "No status";
      noStatus = true;
    }

    let picture = this.props.picture;
    const splitPic = picture.split("=")[0];
    if (splitPic != picture) {
      picture = splitPic + "=s150";
    }

    const posts = this.props.posts;
    let postsExist = posts != null && Object.keys(posts).length > 0 ? true : false;
    let orderedPostList;
    if (postsExist) {
      orderedPostList = Object.keys(posts).sort((a, b) => b - a);
    }

    return (
      <div className={this.props.classes}>


        <div className="HPUserProfile">
          <div className="ppLeft">
            <img src={picture} className="pplPFP" alt={this.props.name} />
            <h1 className="pplName">{this.props.name}{/*<Edit className="hpEditIcon hpeiName" />*/}</h1>
            <p className="pplStatus" style={this.state.editingStatus ? {display: "none"} : noStatus ? {fontStyle: "normal", color: "#fff5"} : null}>{status}<Edit className="hpEditIcon hpeiStatus" onClick={() => {this.setState({editingStatus: true}); this.statusInputRef.current.focus(); this.statusInputRef.current.setSelectionRange(this.state.statusInputVal.length, this.state.statusInputVal.length);}} /></p>
            <div className={this.state.editingStatus ? "hpChangeStatusDiv" : "hpChangeStatusDiv hpChangeStatusDivHidden"}>
              <TextareaAutosize value={this.state.statusInputVal} className={this.state.editingStatus ? "hpStatusInput" : "hpStatusInput hpStatusInputHidden"} onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} ref={this.statusInputRef} maxlength={180} />
              <Close className="hpEditIcon hpCloseIcon" onClick={() => this.setState({statusInputVal: this.props.status, editingStatus: false})} />
            </div>
          </div>
          <div className="ppRight">
            <div className="pprPostList">
              <h3>Posts</h3>
              <TextareaAutosize value={this.state.newPostVal} className="hpPostInput" onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} placeholder="Create post here" />

              { orderedPostList ?
                orderedPostList.map((item) => {
                  const myPost = posts[item];
                  return (
                    <div className="pprPost">
                      <p>{myPost.message}</p>
                      <div className="pprPostBottom">
                        <div>
                          <ThumbUp className="hpPostThumbUp" />
                          <p>{myPost.likes}</p>
                        </div>
                        <p className="pprPostTimestamp">{parseDate(myPost.timestamp)}</p>
                      </div>
                    </div>
                  )
                })
                : null
              }


              {
                postsExist ? null :
                <div key="id_no_posts" style={{display: "table", width: "100%", height: "100%"}}>
                  <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px"}}>No posts</h1>
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



        {/*
          <div style={{display: "table", width: "100%", height: "100%"}}>
            <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px"}}>No profile</h1>
          </div>
        */}

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  name: state.app.name,
  picture: state.app.picture,
  status: state.app.status,
  posts: state.app.posts,
});

export default connect(mapStateToProps, null)(HomeProfile);
