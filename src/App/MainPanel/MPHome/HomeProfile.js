import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { connect } from 'react-redux';

import './HomeProfile.css';
import { ReactComponent as Edit } from '../../../assets/icons/edit.svg';
import { ReactComponent as Close } from '../../../assets/icons/close.svg';
import { set_status } from '../../../socket.js';

class HomeProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      statusInputVal: this.props.status,
      editingStatus: false
    };

    this.statusInputRef = React.createRef();

    this.handleStatusInputChange = this.handleStatusInputChange.bind(this);
    this.statusInputEnterPressed = this.statusInputEnterPressed.bind(this);
  }

  handleStatusInputChange(event) {
    if (this.state.editingStatus) {
      this.setState({statusInputVal: event.target.value})
    }
  }

  statusInputEnterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      event.stopPropagation();

      if (this.state.statusInputVal != this.props.status) {
        set_status(this.state.statusInputVal);
      }
      this.setState({editingStatus: false});
    }
  }

  render() {
    let noStatus = false;
    let status = this.props.status;
    if (!status || status == "") {
      status = "No status";
      noStatus = true;
    }

    return (
      <div className={this.props.classes}>


        <div className="HPUserProfile">
          <div className="ppLeft">
            <img src={this.props.picture.split("=")[0]} className="pplPFP" alt={this.props.name} />
            <h1 className="pplName">{this.props.name}{/*<Edit className="hpEditIcon hpeiName" />*/}</h1>
            <p className="pplStatus" style={this.state.editingStatus ? {display: "none"} : noStatus ? {fontStyle: "normal", color: "#fff5"} : null}>{status}<Edit className="hpEditIcon hpeiStatus" onClick={() => {this.setState({editingStatus: true}); this.statusInputRef.current.focus(); this.statusInputRef.current.setSelectionRange(this.state.statusInputVal.length, this.state.statusInputVal.length);}} /></p>
            <div className={this.state.editingStatus ? "hpChangeStatusDiv" : "hpChangeStatusDiv hpChangeStatusDivHidden"}>
              <TextareaAutosize value={this.state.statusInputVal} className={this.state.editingStatus ? "hpStatusInput" : "hpStatusInput hpStatusInputHidden"} onChange={this.handleStatusInputChange} onKeyPress={this.statusInputEnterPressed} ref={this.statusInputRef} maxlength={180} />
              <Close className="hpEditIcon hpCloseIcon" onClick={() => this.setState({statusInputVal: this.props.status, editingStatus: false})} />
            </div>
          </div>
          <div className="ppRight">
            <div key="id_no_posts" style={{display: "table", width: "100%", height: "100%"}}>
              <h1 style={{position: "relative", display: "table-cell", margin: "0", textAlign: "center", verticalAlign: "middle", color: "#fff5", fontSize: "16px"}}>No posts</h1>
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
});

export default connect(mapStateToProps, null)(HomeProfile);
