import React from 'react';
import { connect } from 'react-redux';

import './UserProfile.css';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mainClasses: "UserProfile UserProfileHide",
      picture: "",
      name: "",
      status: ""
    };

    this.panelRef = React.createRef();

    this.reloadData = this.reloadData.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    this.reloadData();
    // document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('mouseup', this.handleClickOutside);
  }

  componentWillUnmount() {
    // document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('mouseup', this.handleClickOutside);
  }

  componentDidUpdate() {
    this.reloadData();
  }

  reloadData() {
    let newClasses = "";
    if (this.props.email == "") {
      newClasses = "UserProfile UserProfileHide";
    } else {
      newClasses = "UserProfile";
    }

    // let newChildren = this.state.children;
    let newPicture = this.state.picture;
    let newName = this.state.name;
    let newStatus = this.state.status;
    if (this.props.email != "") {
      // if (newChildren.length == 0 || newChildren[0].key != this.props.email) {
      //   const placeholder = (<div key={this.props.email} style={{display: "table", width: "100%", height: "100%"}}>
      //       <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px"}}>{this.props.knownPeople[this.props.email].name}'s profile</h1>
      //     </div>);
      //   newChildren = [placeholder];
      // }
      newPicture = this.props.knownPeople[this.props.email].picture;
      newName = this.props.knownPeople[this.props.email].name;
      let status = "hi im " + newName + " and this is my status";

      if (this.props.email == "everettflynn25@gmail.com") {
        status = "officially done with school, coding time.";
      } else if (this.props.email == "cherryman656@gmail.com") {
        status = "Use my other account: everettflynn25@gmail.com";
      } else if (this.props.email == "appleandroidtechmaker@gmail.com") {
        status = "This is my chat account.";
      } else if (this.props.email == "flynneverett@logoscharter.com") {
        status = "Me gusta el español.";
      }

      newStatus = status;
    }

    if (this.state.mainClasses != newClasses || this.state.picture != newPicture || this.state.name != newName || this.state.status != newStatus) {
      this.setState({ mainClasses: newClasses, picture: newPicture, name: newName, status: newStatus });
    }
  }

  handleClickOutside(event) {
    if (this.panelRef && !this.panelRef.contains(event.target) && this.props.email != "") {
      this.props.onclose();
    }
  }

  setWrapperRef(node) {
    if (node != null) {
      this.panelRef = node;
    }
  }

  render() {
    return (
      <div className={this.state.mainClasses} onClick={/*this.props.onclose*/null}>
        <div className={this.state.mainClasses == "UserProfile" ? "profilePanel" : "profilePanel profilePanelHide"} ref={this.setWrapperRef}>
          <div className="ppLeft">
            <img src={this.state.picture} className="pplPFP" alt={this.state.name} />
            <h1 className="pplName">{this.state.name}</h1>
            <p className="pplStatus" title={this.state.status}>{this.state.status}</p>
          </div>
          <div className="ppRight">
            <div key="id_no_posts" style={{display: "table", width: "100%", height: "100%"}}>
              <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px"}}>No posts</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  knownPeople: state.people.knownPeople
});

export default connect(mapStateToProps, null)(UserProfile);
