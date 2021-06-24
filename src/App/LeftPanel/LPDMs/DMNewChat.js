import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import add from '../../../assets/icons/add.svg';
import { ReactComponent as Add } from '../../../assets/icons/add.svg';
import './DMNewChat.css';
import { dms_request_to_chat } from '../../../socket.js';
import { addRequest } from '../../../redux/dmsReducer.js'

class DMNewChat extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.inputEnterPressed = this.inputEnterPressed.bind(this);

    this.inputRef = React.createRef();

    this.handleClick = this.handleClick.bind(this);
    this.state = {
      dropdown: false,
      inputValue: "",
      status: "",
      emailRequested: ""
    };
  }

  componentDidMount() {
    // document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('mouseup', this.handleClickOutside);
  }

  componentWillUnmount() {
    // document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('mouseup', this.handleClickOutside);
  }

  componentDidUpdate() {
    if (this.state.emailRequested != "" && !this.props.requesting.includes(this.state.emailRequested)) {
      if (this.props.requested.includes(this.state.emailRequested)) {
        this.setState({
          status: "Successfully requested:\n" + this.state.emailRequested,
          emailRequested: ""
        });
      } else if (this.props.requested_me.includes(this.state.emailRequested)) {
        this.setState({
          status: "That person already requested you! We created a chat for you.",
          emailRequested: ""
        });
      } else if (this.props.already_requested.includes(this.state.emailRequested)) {
        this.setState({
          status: "You already requested that person!",
          emailRequested: ""
        });
      } else if (this.props.chat_exists.includes(this.state.emailRequested)) {
        this.setState({
          status: "You already have a chat with that person!",
          emailRequested: ""
        });
      }
    }
  }

  setWrapperRef(node) {
    if (node != null) {
      if (node.className.startsWith("ncDropdown")) {
        this.ddWrapperRef = node;
      } else if (node.className == "DMNewChat") {
        this.ncWrapperRef = node;
      }
    }
  }

  handleClickOutside(event) {
    if (this.ddWrapperRef && this.ncWrapperRef && !this.ddWrapperRef.contains(event.target) && !this.ncWrapperRef.contains(event.target) && this.state.dropdown) {
      let s = this.state.status;
      if (this.state.emailRequested == "") {
        s = "";
      }
      this.setState({
        dropdown: false,
        inputValue: "",
        status: s
      });
    }
  }

  handleClick() {
    if (this.state.dropdown) {
      let s = this.state.status;
      if (this.state.emailRequested == "") {
        s = "";
      }
      this.setState({
        dropdown: false,
        inputValue: "",
        status: s
      });
    } else {
      this.setState({dropdown: true});
      var root = this;
      setTimeout(function() {
        root.inputRef.current.focus();
      }, 10);
    }
  }

  handleInputChange(event) {
    this.setState({
      inputValue: event.target.value
    });
  }

  inputEnterPressed(event) {
    var code = event.keyCode || event.which;
    if (code === 13 && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();

      // if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.state.inputValue)) {
      if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        .test(this.state.inputValue)) {
        if (this.props.requested.includes(this.state.inputValue) || this.props.already_requested.includes(this.state.inputValue)) {
          this.setState({
            status: "You already requested that person!"
          });
        } else if (this.props.chat_exists.includes(this.state.inputValue) || Object.keys(this.props.chats).includes(this.state.inputValue)) {
          this.setState({
            status: "You already have a chat with that person!"
          });
        } else {
          this.setState({
            inputValue: "",
            status: "Sending request to " + this.state.inputValue + "...",
            emailRequested: this.state.inputValue,
          });
          const iv = this.state.inputValue;
          this.props.addRequest({type: "requesting", email: iv})
          dms_request_to_chat(iv);
        }
      } else {
        this.setState({
          status: "Invalid email"
        });
      }
    }
  }

  render() {
    return(
      <Fragment>
        <div className={this.state.dropdown ? "DMNewChat DMNewChatHide" : "DMNewChat"} onClick={this.handleClick} ref={this.setWrapperRef}>
          {/*<img src={add} className="ncAddIcon" alt="Add Icon" />*/}
          <Add className="ncAddIcon" alt="Add Icon" />
          <h1 className="ncText">Create Chat</h1>
        </div>
        {/*
        <div className={this.state.dropdown ? "oldncDropdown" : "oldncDropdown oldncDropdownHide"} ref={this.setWrapperRef}>
          <h1 className="oldncddTitle">New Chat</h1>
          <h1 className="oldncddText">Email:</h1>
          <input value={this.state.inputValue} onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} className="oldncddInput" placeholder="Type email here" ref={this.inputRef} disabled={this.state.emailRequested == "" ? "" : "disabled"} />
          <h1 className="oldncddStatus">{this.state.status}</h1>
        </div>
        */}
        <div className={this.state.dropdown ? "ncDropdown" : "ncDropdown ncDropdownHide"} ref={this.setWrapperRef}>
          {/*<img src={add} className="ncAddIcon" alt="Add Icon" />*/}
          <h1 className="ncdTitle">Create Chat</h1>
          <h1 className="ncdText">Email:</h1>
          <input value={this.state.inputValue} onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} className="ncdInput" placeholder="Type email here" ref={this.inputRef} disabled={this.state.emailRequested == "" ? "" : "disabled"} />
          <h1 className="ncdStatus">{this.state.status}</h1>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  requesting: state.dms.requesting,
  requested: state.dms.requested,
  requested_me: state.dms.requested_me,
  already_requested: state.dms.already_requested,
  chat_exists: state.dms.chat_exists,
  chats: state.dms.chats
});

const mapDispatchToProps = {
  addRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(DMNewChat);
