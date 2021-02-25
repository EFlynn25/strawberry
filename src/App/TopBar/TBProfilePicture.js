import React from 'react';

import './TBProfilePicture.css'

class TBProfilePicture extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.handleClick = this.handleClick.bind(this);
    this.state = {dropdown: false};
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    if (node.className == "tbDropdown") {
      this.ddWrapperRef = node;
    } else if (node.className == "mainPFP") {
      this.pfpWrapperRef = node;
    }
  }

  handleClickOutside(event) {
    if (this.ddWrapperRef && this.pfpWrapperRef && !this.ddWrapperRef.contains(event.target) && !this.pfpWrapperRef.contains(event.target) && this.state.dropdown) {
      this.setState({dropdown: false});
    }
  }

  handleClick() {
    this.setState({dropdown: !this.state.dropdown});
  }

  render() {
    return (
      <div className="TBProfilePicture">
        <img src={this.props.src} className="mainPFP" alt="Profile picture" onClick={this.handleClick} ref={this.setWrapperRef} />
        <div className={this.state.dropdown ? "tbDropdown" : "tbDropdown tbDropdownHide"} ref={this.setWrapperRef}>
          <p style={{color: "white", fontFamily: "Comic Sans MS", margin: "10px"}}>im a dropdown lol</p>
        </div>
      </div>
    )
  }
}

export default TBProfilePicture;
