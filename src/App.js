import rlogo from './sred.svg';
import './App.css';

import TopBar from './App/TopBar';
import LeftPanel from './App/LeftPanel';
import MainPanel from './App/MainPanel';
import RightPanel from './App/RightPanel';

import { Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <TopBar />
      <LeftPanel />
      <MainPanel />
      <RightPanel />
    </div>
  );
}

export default App;
