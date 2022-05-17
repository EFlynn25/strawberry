import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';

import './index.css';
import App from './App';
import store from './redux/mainStore';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// import history from "./history";

TimeAgo.addDefaultLocale(en);
const customLabels = {
  minute: {
    past: {
      one: "{0} min ago",
      other: "{0} mins ago"
    }
  },
  hour: {
    past: {
      one: "{0} hour ago",
      other: "{0} hours ago"
    }
  },
}
TimeAgo.addLabels('en', 'custom', customLabels);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// serviceWorkerRegistration.register();
