import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import add from '../../../assets/icons/add.svg';
import { ReactComponent as Add } from '../../../assets/icons/add.svg';
import { ReactComponent as AddGroup } from '../../../assets/icons/add_group.svg';
import './GroupsNewThread.css';
import { groups_create_thread } from '../../../socket.js';
import { addThreadCreating } from '../../../redux/groupsReducer.js'

class GroupsNewThread extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdown: false,
      inputValue: "",
      status: "",
      threadCreating: ""
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

    if (this.state.threadCreating != "" && !this.props.threadsCreating.includes(this.state.threadCreating)) {
      if (this.props.threadsCreated.includes(this.state.threadCreating)) {
        this.setState({
          status: ["Successfully created:", <br/>, this.state.threadCreating],
          threadCreating: ""
        });
      }
    }

  }

  setWrapperRef(node) {
    if (node != null) {
      if (node.className.startsWith("ntDropdown")) {
        this.ddWrapperRef = node;
      } else if (node.className == "GroupsNewThread") {
        this.ntWrapperRef = node;
      }
    }
  }

  handleClickOutside(event) {
    if (this.ddWrapperRef && this.ntWrapperRef && !this.ddWrapperRef.contains(event.target) && !this.ntWrapperRef.contains(event.target) && this.state.dropdown) {
      if (event.type == "mousedown") {
        this.mousePressedDown = true;
      } else if (event.type == "mouseup") {
        if (this.mousePressedDown) {
          let s = this.state.status;
          if (this.state.threadCreating == "") {
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
    if (this.state.dropdown) { // may not need this since the button disappears when clicked
      let s = this.state.status;
      if (this.state.threadCreating == "") {
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

      // if (this.props.requested.includes(this.state.inputValue) || this.props.already_requested.includes(this.state.inputValue)) {
      //   this.setState({
      //     status: "You already requested that person!"
      //   });
      // } else if (this.props.chat_exists.includes(this.state.inputValue) || Object.keys(this.props.chats).includes(this.state.inputValue)) {
      //   this.setState({
      //     status: "You already have a chat with that person!"
      //   });
      // } else {
      //
      // }

      this.setState({
        inputValue: "",
        status: ["Creating thread named", <br/>, "\"", this.state.inputValue, "\""],
        threadCreating: this.state.inputValue,
      });
      const iv = this.state.inputValue;
      this.props.addThreadCreating(iv);
      groups_create_thread(iv, []);

    }
  }

  render() {
    return(
      <Fragment>
        <div className={this.state.dropdown ? "GroupsNewThread GroupsNewThreadHide" : "GroupsNewThread"} onClick={this.handleClick} ref={this.setWrapperRef}>
          <Add className="ntAddIcon" alt="Add Icon" />
          <h1 className="ntText">Create Thread</h1>
        </div>
        <div className={this.state.dropdown ? "ntDropdown" : "ntDropdown ntDropdownHide"} ref={this.setWrapperRef}>
          <AddGroup className="ntdIcon" />
          <h1 className="ntdTitle">Create Thread</h1>
          <h1 className="ntdText">Name:</h1>
          <input value={this.state.inputValue} onChange={this.handleInputChange} onKeyPress={this.inputEnterPressed} className="ntdInput" placeholder="Type name here" ref={this.inputRef} disabled={this.state.threadCreating == "" ? "" : "disabled"} maxlength="48" />
          <p className="ntdStatus">{this.state.status}</p>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  threadsCreating: state.groups.threadsCreating,
  threadsCreated: state.groups.threadsCreated,
  threads: state.groups.threads
});

const mapDispatchToProps = {
  addThreadCreating
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupsNewThread);
