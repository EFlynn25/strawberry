import './LPTabs.css';

function LPTabs() {
  function handleClick(e) {
    e.preventDefault();
    console.log("tabs");
  }

  return (
    <div className="LPTabs" onClick={handleClick}>
      <div className="dmTab">
        <div className="dmTabInner">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="dmIcon">
            <defs>
              <linearGradient
                id="dmIconGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#0078D4" stopOpacity="1" />
                <stop offset="100%" stopColor="#1540C2" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
          <h1 className="dmText">DMs</h1>
        </div>
        <div className="dmSelected">
        </div>
      </div>
      <div className="groupsTab">
        <div className="groupsTabInner">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="groupsIcon">
            <defs>
              <linearGradient
                id="groupsIconGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#6AE292" stopOpacity="1" />
                <stop offset="100%" stopColor="#1D9545" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
          </svg>
          <h1 className="groupsText">Groups</h1>
        </div>
        <div className="groupsSelected">
        </div>
      </div>
    </div>
  );
}

export default LPTabs;
