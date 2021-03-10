import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import add from '../../../assets/icons/add.svg';
import './DMNewChat.css';
import { dms_request_to_chat } from '../../../socket.js';

class DMNewChat extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.inputEnterPressed = this.inputEnterPressed.bind(this);

    this.handleClick = this.handleClick.bind(this);
    this.state = {
      dropdown: false,
      inputValue: "",
      status: "",
      emailRequested: ""
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  componentDidUpdate() {
    if (!this.state.status.startsWith("Success")) {
      if (this.props.requested.includes(this.state.emailRequested)) {
        this.setState({
          status: "Successfully requested:\n" + this.state.emailRequested,
          emailRequested: ""
        });
      } else if (this.props.alreadyRequested.includes(this.state.emailRequested)) {
        this.setState({
          status: "That person already requested you!\nWe created a chat for you.",
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
      this.setState({
        dropdown: false,
        inputValue: "",
        status: "",
      });
    }
  }

  handleClick() {
    if (this.state.dropdown) {
      this.setState({
        dropdown: false,
        inputValue: "",
        status: ""
      });
    } else {
      this.setState({dropdown: true});
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

      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.state.inputValue)) {
        this.setState({
          inputValue: "",
          status: "Sending request...",
          emailRequested: this.state.inputValue,
        });
        dms_request_to_chat(this.state.inputValue);
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
        <div className="DMNewChat" onClick={this.handleClick} ref={this.setWrapperRef}>
          <img src={add} className="ncAddIcon" alt="Add Icon" />
          <h1 className="ncText">Create Chat</h1>
        </div>
        <div className={this.state.dropdown ? "ncDropdown" : "ncDropdown ncDropdownHide"} ref={this.setWrapperRef}>
          {/*<p style={{color: "white", fontFamily: "Comic Sans MS", margin: "10px"}}>new chat lol</p>*/}
          <h1 className="ncddTitle">New Chat</h1>
          <h1 className="ncddText">Email:</h1>
          <input value={this.state.inputValue} onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} className="ncddInput" placeholder="Type email here" />
          <h1 className="ncddStatus">{this.state.status}</h1>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  requested: state.dms.requested,
  alreadyRequested: state.dms.alreadyRequested
});

export default connect(mapStateToProps, null)(DMNewChat);
