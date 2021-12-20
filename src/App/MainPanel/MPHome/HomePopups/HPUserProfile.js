import React, { Fragment } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { connect } from 'react-redux';

import './HPUserProfile.css';
import { ReactComponent as ThumbUp } from '../../../../assets/icons/thumb_up.svg';
import { ReactComponent as ThumbUpFilled } from '../../../../assets/icons/thumb_up_filled.svg';
import { getUser } from '../../../../GlobalComponents/getUser.js';
import { parseDate } from '../../../../GlobalComponents/parseDate.js';

class HPUserProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const item = this.props.email;
    const myPerson = getUser(item);
    const name = myPerson.name;
    let picture = myPerson.picture;
    const status = myPerson.status;
    const online = myPerson.online;
    const posts = myPerson.posts;
    let postsExist = posts != null && Object.keys(posts).length > 0 ? true : false;
    let orderedPostList;

    const splitPic = picture.split("=")[0];
    if (splitPic != picture) {
      picture = splitPic + "=s150";
    }

    if (postsExist) {
      orderedPostList = Object.keys(posts).sort((a, b) => b - a);
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
          <div className="pprPostList">

            { orderedPostList ?
              orderedPostList.map((item) => {
                const myPost = posts[item];
                return (
                  <div className="pprPost">
                    <p>{myPost.message}</p>
                    <div className="pprPostBottom">
                      <div>
                        <ThumbUp />
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
            <div className="pprPost">
              <p>Had a great day! I went to the snow, and then my family went to the snow, and then my family went to the snow, and then my family went to the snow!</p>
              <div className="pprPostBottom">
                <div>
                  <ThumbUp />
                  <p>1</p>
                </div>
                <p className="pprPostTimestamp">{parseDate(0)}</p>
              </div>
            </div>
            <div className="pprPost">
              <p>Today sucked.</p>
              <div className="pprPostBottom">
                <div>
                  <ThumbUpFilled />
                  <p>3</p>
                </div>
                <p className="pprPostTimestamp">{parseDate(0)}</p>
              </div>
            </div>
            <div className="pprPost"><p>Today sucked.</p><div className="pprPostBottom"><div><ThumbUpFilled /><p>3</p></div><p className="pprPostTimestamp">{parseDate(0)}</p></div></div>
            <div className="pprPost"><p>Today sucked.</p><div className="pprPostBottom"><div><ThumbUpFilled /><p>3</p></div><p className="pprPostTimestamp">{parseDate(0)}</p></div></div>
            <div className="pprPost"><p>Today sucked.</p><div className="pprPostBottom"><div><ThumbUpFilled /><p>3</p></div><p className="pprPostTimestamp">{parseDate(0)}</p></div></div>
            <div className="pprPost"><p>Today sucked.</p><div className="pprPostBottom"><div><ThumbUpFilled /><p>3</p></div><p className="pprPostTimestamp">{parseDate(0)}</p></div></div>
            <div className="pprPost"><p>Today sucked.</p><div className="pprPostBottom"><div><ThumbUpFilled /><p>3</p></div><p className="pprPostTimestamp">{parseDate(0)}</p></div></div>
            <div className="pprPost"><p>Today sucked.</p><div className="pprPostBottom"><div><ThumbUpFilled /><p>3</p></div><p className="pprPostTimestamp">{parseDate(0)}</p></div></div>
            <div className="pprPost"><p>Today sucked.</p><div className="pprPostBottom"><div><ThumbUpFilled /><p>3</p></div><p className="pprPostTimestamp">{parseDate(0)}</p></div></div>
            <div className="pprPost"><p>Today sucked.</p><div className="pprPostBottom"><div><ThumbUpFilled /><p>3</p></div><p className="pprPostTimestamp">{parseDate(0)}</p></div></div>
            <div className="pprPost"><p>Today sucked.</p><div className="pprPostBottom"><div><ThumbUpFilled /><p>3</p></div><p className="pprPostTimestamp">{parseDate(0)}</p></div></div>
            <div className="pprPost"><p>Today sucked.</p><div className="pprPostBottom"><div><ThumbUpFilled /><p>3</p></div><p className="pprPostTimestamp">{parseDate(0)}</p></div></div>
            <div className="pprPost"><p>Today sucked.</p><div className="pprPostBottom"><div><ThumbUpFilled /><p>3</p></div><p className="pprPostTimestamp">{parseDate(0)}</p></div></div>
            <div className="pprPost"><p>Today sucked.</p><div className="pprPostBottom"><div><ThumbUpFilled /><p>3</p></div><p className="pprPostTimestamp">{parseDate(0)}</p></div></div>
            <div className="pprPost"><p>Today sucked.</p><div className="pprPostBottom"><div><ThumbUpFilled /><p>3</p></div><p className="pprPostTimestamp">{parseDate(0)}</p></div></div>
            <div className="pprPost"><p>Today sucked.</p><div className="pprPostBottom"><div><ThumbUpFilled /><p>3</p></div><p className="pprPostTimestamp">{parseDate(0)}</p></div></div>
            <div className="pprPost"><p>Today sucked.</p><div className="pprPostBottom"><div><ThumbUpFilled /><p>3</p></div><p className="pprPostTimestamp">{parseDate(0)}</p></div></div>
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
  knownPeople: state.people.knownPeople
});

export default connect(mapStateToProps, null)(HPUserProfile);
