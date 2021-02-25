import './OLeftPanel.css';
//import LPHome from './LeftPanel/LPHome'
//import LPSeparator from './LeftPanel/LPSeparator'
//import LPTabs from './LeftPanel/LPTabs'
//import LPGroups from './LeftPanel/LPGroups'
//import LPDMs from './LeftPanel/LPDMs'
// import LPChat from './LeftPanel/LPChat'

import { Switch, Route } from "react-router-dom";

function OLeftPanel() {
  return (
    <div className="OLeftPanel">
      {/*<LPHome />
      <LPSeparator />
      <LPTabs />
      <Switch>
        <Route path="/groups">
          <LPGroups />
        </Route>
        <Route path="/dms">
          <LPDMs />
        </Route>
      </Switch>*/}
    </div>
  );
}

export default OLeftPanel;
