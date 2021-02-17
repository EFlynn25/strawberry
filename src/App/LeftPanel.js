import './LeftPanel.css';
import LPHome from './LeftPanel/LPHome'
import LPSeparator from './LeftPanel/LPSeparator'
import LPTabs from './LeftPanel/LPTabs'
/* import LPChat from './LeftPanel/LPChat' */

function LeftPanel() {
  return (
    <div className="LeftPanel">
      <LPHome />
      <LPSeparator />
      <LPTabs />
    </div>
  );
}

export default LeftPanel;
