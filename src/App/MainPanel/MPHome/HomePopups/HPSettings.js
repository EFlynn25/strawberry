import React from 'react';
import { connect } from 'react-redux';

import { ReactComponent as Settings } from '../../../../assets/icons/settings.svg';
import { ReactComponent as Messages } from '../../../../assets/icons/forum_outline.svg';
import { ReactComponent as Info } from '../../../../assets/icons/info.svg';
import './HPSettings.css';
import HPSWrapper from './HPSettings/HPSWrapper';

class HPSSection extends React.Component {
  render() {
    const MyIcon = this.props.icon;
    return (
      <div className={this.props.tab == this.props.name ? "hpsSection hpsSectionSelected" : "hpsSection"} onClick={() => this.props.setTab(this.props.name)}>
        <div>
          <MyIcon />
          <h1>{this.props.name}</h1>
        </div>
      </div>
    );
  }
}

class HPSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: "Messages",
    };

    this.setTab = this.setTab.bind(this);
  }

  setTab(tab) {
    this.setState({ tab: tab });
  }

  render() {
    return (
      <div className="HPSettings">
        <div className="hpsHeader">
          <h1>Settings</h1>
          <p> > </p>
          <div>
            {/*<h1 className="hpsHeaderPage" style={this.state.tab == "General" ? null : {opacity: 0}}>General</h1>*/}
            <h1 className="hpsHeaderPage" style={this.state.tab == "Messages" ? null : {opacity: 0}}>Messages</h1>
            <h1 className="hpsHeaderPage" style={this.state.tab == "About" ? null : {opacity: 0}}>About</h1>
          </div>
        </div>

        <div className="hpsSections">
          {/*<HPSSection setTab={this.setTab} tab={this.state.tab} name="General" icon={Settings} />*/}
          <HPSSection setTab={this.setTab} tab={this.state.tab} name="Messages" icon={Messages} />
          <HPSSection setTab={this.setTab} tab={this.state.tab} name="About" icon={Info} />
        </div>

        <div className="hpsContent" style={this.state.tab == "General" ? {zIndex: 1} : null}><HPSWrapper tab={this.state.tab} name="General" /></div>
        <div className="hpsContent" style={this.state.tab == "Messages" ? {zIndex: 1} : null}><HPSWrapper tab={this.state.tab} name="Messages" /></div>
        <div className="hpsContent" style={this.state.tab == "About" ? {zIndex: 1} : null}><HPSWrapper tab={this.state.tab} name="About" /></div>


        {/*
          <div style={{display: "flex", width: "100%", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <h1 style={{margin: "0", color: "#fff5", fontSize: "18px"}}>Settings</h1>
          </div>
        */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, null)(HPSettings);
