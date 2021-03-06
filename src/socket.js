import firebase from 'firebase/app';



// Socket start

let socket = null;

export function startSocket() {
  socket = new WebSocket('wss://sberrychat.ddns.net:5000');

  socket.onmessage = function(event) {
    console.log("WebSocket message received: ", event);
  }

  socket.onopen = function(event) {
    console.log("WebSocket is open now");
    firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
      dms_add_user(idToken);
      groups_add_user(idToken);
    }).catch(function(error) {
      // Handle error
    });
  }

  socket.onclose = function(event) {
    if (event.wasClean) {
      console.log("WebSocket closed cleanly, code=" + event.code + " reason=" + event.reason);
    } else {
      console.warn("WebSocket closed uncleanly, code=" + event.code);
    }
    //mainError("Oops! Server connection closed.", true);
  };

  socket.onerror = function(error) {
    console.error("WebSocket error: " + error);
  };

  window.addEventListener("beforeunload", function(event) {
    socket.close(1000, "Browser unloading");
  });
}



// DMS Functions

export function dms_add_user(idToken) {
  var jsonObj = {"product": "dms", "command": "add_user", "idToken": idToken}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}



// Groups Functions

export function groups_add_user(idToken) {
  var jsonObj = {"product": "groups", "command": "add_user", "idToken": idToken}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}
