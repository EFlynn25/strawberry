import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import './HPSMessages.css'
import defaultPreview from '../../../../../assets/images/default_message_preview.png';
import breckanPreview from '../../../../../assets/images/breckan_message_preview.png';
import {
  // setMessageStyle,
  setAppState
} from '../../../../../redux/appReducer';
import { set_setting } from '../../../../../socket.js';

class HPSMessages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMessage: "default"
    }

    this.setStyle = this.setStyle.bind(this)
  }

  componentDidMount() {
    this.setState({
      selectedMessage: this.props.messageStyle
    })
  }

  componentDidUpdate() {
    if (this.state.selectedMessage != this.props.messageStyle) {
      this.setState({
        selectedMessage: this.props.messageStyle
      })
    }
  }

  setStyle(style) {
    set_setting("message_style", style);
    this.props.setAppState({ messageStyle: style });
  }

  render() {
    return (
      <Fragment>
        <div className="hpsmOptions">
          <div className={"hpsmOption" + (this.state.selectedMessage == "default" ? " hpsmOptionSelected" : "")} onClick={() => this.setStyle("default")}>
            <div className="hpsmOptionPreview">
              <img src={defaultPreview} alt={"Default message preview"} />
            </div>
            <div className="hpsmOptionName">
              <h1>Default</h1>
            </div>
          </div>
          <div className={"hpsmOption" + (this.state.selectedMessage == "breckan" ? " hpsmOptionSelected" : "")} onClick={() => this.setStyle("breckan")}>
            <div className="hpsmOptionPreview">
              <img src={breckanPreview} alt={"Breckan message preview"} />
            </div>
            <div className="hpsmOptionName">
              <h1>Breckan</h1>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  messageStyle: state.app.messageStyle,
});

const mapDispatchToProps = {
  setAppState
}

export default connect(mapStateToProps, mapDispatchToProps)(HPSMessages);
