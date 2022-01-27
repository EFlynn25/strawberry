import React from 'react';

import './HPSWrapper.css'
import HPSGeneral from './HPSGeneral'
import HPSMessages from './HPSMessages'
import HPSAbout from './HPSAbout'

class HPSWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      classes: ""
    }

    this.setClasses = this.setClasses.bind(this);
    this.components = {"General": HPSGeneral, "Messages": HPSMessages, "About": HPSAbout}
  }

  componentDidMount() {
    this.setClasses();
  }

  componentDidUpdate() {
    this.setClasses();
  }

  setClasses(prevProps=null) {
    let newClasses = "";
    let show = false;
    if (this.props.tab == this.props.name) {
      show = true;
    }

    if (show) {
      newClasses = "";
    }
    if (!show) {
      const componentArray = Object.keys(this.components);
      if (componentArray.indexOf(this.props.tab) > componentArray.indexOf(this.props.name)) {
        newClasses = "HPSWrapperHideUp"
      } else {
        newClasses = "HPSWrapperHideDown"
      }
    }
    if (this.state.classes != newClasses) {
      this.setState({ classes: newClasses })
    }
  }

  render() {
    const MySection = this.components[this.props.name];
    return (
      <div className={"HPSWrapper " + this.state.classes}>
        <MySection />
      </div>
    )
  }
}

export default HPSWrapper;
