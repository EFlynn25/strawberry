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
      add_user(idToken);
      dms_add_user(idToken);
      groups_add_user(idToken);
      groups_get_thread_info(336529271202);
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



// App Functions

export function add_user(idToken) {
  var jsonObj = {"product": "app", "command": "add_user", "idToken": idToken}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
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

export function groups_get_threads() {
  var jsonObj = {"product": "groups", "command": "get_threads"}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function groups_get_messages(thread_id, id, amount) {
  var jsonObj = {"product": "groups", "command": "get_messages", "thread_id": thread_id, "id": id, "amount": amount}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function groups_get_thread_info(thread_id) {
  var jsonObj = {"product": "groups", "command": "get_thread_info", "thread_id": thread_id}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function groups_create_thread(name, people) {
  var jsonObj = {"product": "groups", "command": "create_thread", "name": name, "people": people}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function groups_send_message(message, thread_id) {
  var jsonObj = {"product": "groups", "command": "send_message", "message": message, "thread_id": thread_id}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function groups_request_to_thread(email, thread_id) {
  var jsonObj = {"product": "groups", "command": "request_to_thread", "requested": email, "thread_id": thread_id}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function groups_join_thread(thread_id) {
  var jsonObj = {"product": "groups", "command": "join_thread", "thread_id": thread_id}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function groups_get_requests() {
  var jsonObj = {"product": "groups", "command": "get_requests"}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function groups_leave_thread(thread_id) {
  var jsonObj = {"product": "groups", "command": "leave_thread", "thread_id": thread_id}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function groups_deny_request(thread_id) {
  var jsonObj = {"product": "groups", "command": "deny_request", "thread_id": thread_id}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function groups_rename_thread(thread_id, name) {
  var jsonObj = {"product": "groups", "command": "rename_thread", "thread_id": thread_id, "name": name}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function groups_get_user_info(email) {
  var jsonObj = {"product": "groups", "command": "get_user_info", "requested": email}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function groups_get_known_people() {
  var jsonObj = {"product": "groups", "command": "get_known_people"}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function groups_in_thread(thread_id, data) {
  var jsonObj = {"product": "groups", "command": "in_thread", "thread_id": thread_id, "data": data}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function groups_typing(thread_id, data) {
  var jsonObj = {"product": "groups", "command": "typing", "thread_id": thread_id, "data": data}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}
