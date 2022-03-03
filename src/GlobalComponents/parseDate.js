import React from 'react';
import ReactTimeAgo from 'react-time-ago'
import { round } from 'javascript-time-ago/steps';

const customStyle = {
  steps: round,
  labels: 'custom'
}

export function parseDate(timestamp, format) {
  const date = new Date(timestamp * 1000);

  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fullYear = date.getFullYear();
  const getDate = date.getDate();
  const realMonth = date.getMonth() + 1;
  const textMonth = shortMonths[date.getMonth()];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  let dtString;
  let addTime = true;
  let timeSeparator = '•'
  if (format == "basic") {
    addTime = false;
    dtString = realMonth + '/' + getDate + '/' + fullYear + ' ' + hours + ':' + minutes + ":" + seconds + ' ' + ampm;
  } else if (format == "time") {
    addTime = false;
    dtString = hours + ':' + minutes + ' ' + ampm;
  } else if (format == "short" || format == "long") {

    if (format == "short") {
      addTime = false;
    }
    const timeNow = new Date();
    if (fullYear < timeNow.getFullYear()) {
      const twoDigitYear = fullYear.toString().substr(-2);
      dtString = realMonth + '/' + getDate + '/' + twoDigitYear;
    } else {
      const total_seconds = (timeNow - date) / 1000;
      const days_difference = Math.floor(total_seconds / (60 * 60 * 24));
      if (days_difference > 6) {
        dtString = textMonth + ' ' + getDate;
      } else {
        if (getDate == timeNow.getDate()) {
          addTime = false;
          dtString = hours + ':' + minutes + ' ' + ampm;
        } else if (getDate == timeNow.getDate() - 1) {
          dtString = "yesterday";
          timeSeparator = 'at';
        } else {
          const shortMonths = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          dtString = shortMonths[date.getDay()];
          timeSeparator = 'at';
        }
      }
    }

  } else {
    dtString = textMonth + ' ' + getDate + ', ' + fullYear;
  }


  if (addTime) {
    dtString += ' ' + timeSeparator + ' ' + hours + ':' + minutes + ' ' + ampm;
  }
  return dtString;
}

export function ParseDateLive({ timestamp, format }) {
  const timeNow = new Date().getTime();
  const msTimestamp = timestamp * 1000;
  const timeSince = timeNow - msTimestamp;
  const newTimestamp = !timestamp || msTimestamp > timeNow ? timeNow : msTimestamp;
  if (timeSince > 14400000) {
    return parseDate(newTimestamp / 1000, format);
  }

  return <ReactTimeAgo tooltip={false} date={newTimestamp} round="floor" timeStyle={customStyle} />
}
