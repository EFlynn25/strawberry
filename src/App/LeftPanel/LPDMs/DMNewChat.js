import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import equal from 'fast-deep-equal/react';

import { ReactComponent as Add } from '../../../assets/icons/add.svg';
import { ReactComponent as AddPerson } from '../../../assets/icons/add_person.svg';
import './DMNewChat.css';
import { dms_request_to_chat } from '../../../socket.js';
import { addChatRequest } from '../../../redux/dmsReducer.js'
import { isEmail } from '../../../GlobalComponents/smallFunctions.js'

class DMNewChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdown: false,
      inputValue: "",
      status: "",
      emailRequested: ""
    };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.inputEnterPressed = this.inputEnterPressed.bind(this);

    this.handleClick = this.handleClick.bind(this);

    this.inputRef = React.createRef();

    this.mousePressedDown = false;
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.handleClickOutside);
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleClickOutside);
    document.removeEventListener('mousedown', this.handleClickOutside);
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

  shouldComponentUpdate(nextProps) {
    return !equal(this.props, nextProps);
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

  handleClickOutside(event) { // Like MPPopup, this makes sure the user has pressed both down and up outside of the panel before closing
    if (this.ddWrapperRef && this.ncWrapperRef && !this.ddWrapperRef.contains(event.target) && !this.ncWrapperRef.contains(event.target) && this.state.dropdown) {
      if (event.type == "mousedown") {
        this.mousePressedDown = true;
      } else if (event.type == "mouseup") {
        if (this.mousePressedDown) {
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
    }

    if (event.type == "mouseup") {
      this.mousePressedDown = false;
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
      let root = this;
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
    let code = event.keyCode || event.which;
    if (code === 13 && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();

      // Why is this regex so long... I just wanted to be as precise as possible...
      if (isEmail(this.state.inputValue)) {
        if (this.props.requested.includes(this.state.inputValue) || this.props.already_requested.includes(this.state.inputValue)) {
          this.setState({
            status: "You already requested that person!"
          });
        } else if (this.props.chat_exists.includes(this.state.inputValue) || this.props.chatList.includes(this.state.inputValue)) {
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
          this.props.addChatRequest({type: "requesting", email: iv})
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
          <Add className="ncAddIcon" alt="Add Icon" />
          <h1 className="ncText">Create Chat</h1>
        </div>
        <div className={this.state.dropdown ? "ncDropdown" : "ncDropdown ncDropdownHide"} ref={this.setWrapperRef}>
          <AddPerson className="ntdIcon" />
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
});

const mapDispatchToProps = {
  addChatRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(DMNewChat);
