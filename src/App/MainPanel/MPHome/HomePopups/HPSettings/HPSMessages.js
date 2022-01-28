import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import './HPSMessages.css'
import defaultPreview from '../../../../../assets/images/default_message_preview.png';
import breckanPreview from '../../../../../assets/images/breckan_message_preview.png';
import {
  setMessageStyle
} from '../../../../../redux/appReducer';

class HPSMessages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMessage: "default"
    }
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

  render() {
    const now = Math.floor(Date.now() / 1000);
    return (
      <Fragment>
        <div className="hpsmOptions">
          {/*<div className={"hpsmOption" + (this.state.selectedMessage == "default" ? " hpsmOptionSelected" : "")} onClick={() => this.setState({selectedMessage: "default"})}>*/}
          <div className={"hpsmOption" + (this.state.selectedMessage == "default" ? " hpsmOptionSelected" : "")} onClick={() => this.props.setMessageStyle("default")}>
            <div className="hpsmOptionPreview">
              <img src={defaultPreview} />
            </div>
            <div className="hpsmOptionName">
              <h1>Default</h1>
            </div>
          </div>
          {/*<div className={"hpsmOption" + (this.state.selectedMessage == "breckan" ? " hpsmOptionSelected" : "")} onClick={() => this.setState({selectedMessage: "breckan"})}>*/}
          <div className={"hpsmOption" + (this.state.selectedMessage == "breckan" ? " hpsmOptionSelected" : "")} onClick={() => this.props.setMessageStyle("breckan")}>
            <div className="hpsmOptionPreview">
              <img src={breckanPreview} />
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
  setMessageStyle
}

export default connect(mapStateToProps, mapDispatchToProps)(HPSMessages);
