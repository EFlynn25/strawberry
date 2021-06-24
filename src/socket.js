import firebase from 'firebase/app';
import { useDispatch } from 'react-redux'
import { setdmsLoaded, setpeopleLoaded, setSocket, setAnnouncement, setAnnouncementRead } from './redux/appReducer.js'
import { addChat, addMessage, removeSendingMessage, setCreated, setLastRead, setTyping, setInChat, addRequest, removeRequest
  // removeRequesting, addRequested, addRequestedMe
 } from './redux/dmsReducer.js'
import { addPerson } from './redux/peopleReducer.js'
import mainStore from './redux/mainStore.js';


// Socket start

let socket = null;

export function startSocket() {
  // socket = new WebSocket('wss://sberrychat.ddns.net:5000');
  socket = new WebSocket('wss://sberrychat.ddns.net:5001');

  setTimeout(function() {
    if (socket.readyState == 0) {
      socket.close();
    } else {
      // set_announcement_read("home_update");
    }
  }, 5000);

  socket.onmessage = function(event) {
    console.log("WebSocket message received: ", event);
    var jsonData = JSON.parse(event.data);
    var product = jsonData.product;
    var com = jsonData.command;
    if (product == "app") {


      /* Get functions */
      if (com == "get_user_info") {

        // if ("chats" in jsonData) {
        //   const chatsList = jsonData.chats;
        //   console.log(chatsList);
        //   if (Array.isArray(chatsList) && chatsList.length) {
        //     chatsList.map(item => {
        //       get_user_info(item);
        //       mainStore.dispatch(addChat(item));
        //     });
        //   }
        // }
        mainStore.dispatch(addPerson({"email": jsonData.email, "name": jsonData.name, "picture": jsonData.picture}));

        if (!mainStore.getState().app.peopleLoaded) {
          let missingPerson = false;
          const chats = Object.keys(mainStore.getState().dms.chats);
          const people = Object.keys(mainStore.getState().people.knownPeople);
          chats.map(item => {
            if (!people.includes(item)) {
              missingPerson = true;
            }
          });
          if (!missingPerson) {
            mainStore.dispatch(setpeopleLoaded(true));
          }
        }
      } else if (com == "get_announcements") {
        if (jsonData.response == true || jsonData.response == "receive_new_announcement") {
          jsonData.announcements.forEach((announcement) => {
            if (!Object.keys(mainStore.getState().app.announcements).includes(announcement.id)) {
              mainStore.dispatch(setAnnouncement({"id": announcement.id, "title": announcement.title, "content": announcement.content, "timestamp": announcement.timestamp}));
            }
          });

          if (jsonData.response != "receive_new_announcement") {
            jsonData.announcements_read.forEach((id) => {
              if (!mainStore.getState().app.announcementsRead.includes(id)) {
                mainStore.dispatch(setAnnouncementRead(id));
              }
            });
          }
        }
      } else if (com == "set_announcement_read") {
        if (jsonData.response == true) {
          jsonData.ids.forEach((id) => {
            if (!mainStore.getState().app.announcementsRead.includes(id)) {
              mainStore.dispatch(setAnnouncementRead(id));
            }
          });
        }
      }


      /* Set functions */

      // there are none

    } else if (product == "dms") {


      /* Get Functions */
      if (com == "get_chats") {
        if (jsonData.response == true) {
          const chatsList = jsonData.chats;
          chatsList.map(item => {
            get_chat_info(item);
          });
        } else if (jsonData.response == "accepted_request") {
          const item = jsonData.chat;
          get_chat_info(item);
        } else if (jsonData.response == "no_chats") {
          mainStore.dispatch(setpeopleLoaded(true));
          mainStore.dispatch(setdmsLoaded(true));
        }
      } else if (com == "get_messages") {
        if (jsonData.response == true) {
          jsonData.messages.map(item => {
            let myFrom = "them";
            if (mainStore.getState().app.email == item.email) {
              myFrom = "me";
            }
            mainStore.dispatch(addMessage({chat: jsonData.chat, message: item.message, from: myFrom, id: item.id, timestamp: item.timestamp}));
          });
        } else if (jsonData.response == "receive_message") {
            let myFrom = "them";
            const item = jsonData.message;
            mainStore.dispatch(addMessage({chat: jsonData.chat, message: item.message, from: myFrom, id: item.id, timestamp: item.timestamp}));
        } else if (jsonData.response == "no_messages") {
          dms_get_chat_created(jsonData.chat);
        }

        if (!mainStore.getState().app.dmsLoaded) {
          let missingMessages = false;
          const messages = mainStore.getState().dms.chats;
          const messageKeys = Object.keys(messages);
          messageKeys.map(item => {
            const myMessages = messages[item].messages;
            if (myMessages == null) {
              missingMessages = true;
            }
          });
          if (!missingMessages || jsonData.response == "no_messages") {
            mainStore.dispatch(setdmsLoaded(true));
          }
        }
      } else if (com == "get_chat_created") {
        if (jsonData.response == true) {
          mainStore.dispatch(setCreated({chat: jsonData.chat, created: jsonData.created}));
        }
      }


      /* Set Functions */
      else if (com == "add_user") {
        dms_get_chats();
      } else if (com == "request_to_chat") {
        mainStore.dispatch(addRequest({"type": jsonData.response, "email": jsonData.requested}));
        mainStore.dispatch(removeRequest({"type": "requesting", "email": jsonData.requested}));
        if (jsonData.response == "requested_me") {
          const item = jsonData.chat;
          get_chat_info(item);
        }
      } else if (com == "send_message") {
        const myMessage = jsonData.message;
        mainStore.dispatch(removeSendingMessage({"chat": jsonData.chat, "message": jsonData.message.message}));
        mainStore.dispatch(addMessage({chat: jsonData.chat, message: myMessage.message, from: "me", id: myMessage.id, timestamp: myMessage.timestamp}));
      }


      /* Hybrid Functions */
      else if (com == "in_chat") {
        if (mainStore.getState().app.email != jsonData.email) {
          mainStore.dispatch(setInChat({"chat": jsonData.chat, "data": jsonData.data}));
        }
        if ("lastRead" in jsonData) {
          if (mainStore.getState().app.email != jsonData.email) {
            mainStore.dispatch(setLastRead({"who": "them", "chat": jsonData.chat, "lastRead": jsonData.lastRead}));
          } else if (mainStore.getState().app.email == jsonData.email) {
            mainStore.dispatch(setLastRead({"who": "me", "chat": jsonData.chat, "lastRead": jsonData.lastRead}));
          }
        } else if (!("lastRead" in jsonData) && !jsonData.data && jsonData.response != "get_in_chat") {
          const myMessages = mainStore.getState().dms.chats[jsonData.chat].messages;
          if (myMessages != null && myMessages.length > 0) {
            mainStore.dispatch(setLastRead({"who": "them", "chat": jsonData.chat, "lastRead": myMessages[myMessages.length - 1].id}));
          }
        }
      } else if (com == "typing") {
        // mainStore.dispatch(setLastRead({"who": "me", "chat": jsonData.chat, "lastRead": jsonData.me}));
        // mainStore.dispatch(setLastRead({"who": "them", "chat": jsonData.chat, "lastRead": jsonData.them}));
        if (mainStore.getState().app.email != jsonData.email) {
          mainStore.dispatch(setTyping({"chat": jsonData.chat, "data": jsonData.data}));
        }
      } else if (com == "last_read") {
        mainStore.dispatch(setLastRead({"who": "me", "chat": jsonData.chat, "lastRead": jsonData.me}));
        mainStore.dispatch(setLastRead({"who": "them", "chat": jsonData.chat, "lastRead": jsonData.them}));
      }
    }
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
    mainStore.dispatch(setSocket(true));
  }

  socket.onclose = function(event) {
    if (event.wasClean) {
      console.log("WebSocket closed cleanly, code=" + event.code + " reason=" + event.reason);
    } else {
      console.warn("WebSocket closed uncleanly, code=" + event.code);
    }
    mainStore.dispatch(setSocket(false));
  };

  socket.onerror = function(error) {
    console.error("WebSocket error: ", error);
  };

  window.addEventListener("beforeunload", function(event) {
    socket.close(1000, "Browser unloading");
  });
}

function get_chat_info(chat) {
  get_user_info(chat);
  mainStore.dispatch(addChat(chat));
  dms_get_messages(chat, "latest", 20);
  dms_in_chat(chat, "get_in_chat");
  dms_last_read(chat);
}



// App Functions

// Get functions

export function get_user_info(requested) {
  var jsonObj = {"product": "app", "command": "get_user_info", "requested": requested}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function get_announcements() {
  var jsonObj = {"product": "app", "command": "get_announcements"}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

// Set functions

export function add_user(idToken) {
  var jsonObj = {"product": "app", "command": "add_user", "idToken": idToken}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function add_announcement(id, title, content) {
  var jsonObj = {"product": "app", "command": "add_announcement", "id": id, "title": title, "content": content}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function set_announcement_read(ids) {
  var jsonObj = {"product": "app", "command": "set_announcement_read", "ids": ids}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}



// DMS Functions

// Get functions

export function dms_get_chats() {
  var jsonObj = {"product": "dms", "command": "get_chats"}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function dms_get_messages(email, id, amount) {
  var jsonObj = {"product": "dms", "command": "get_messages", "chat": email, "id": id, "amount": amount}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function dms_get_chat_created(email) {
  var jsonObj = {"product": "dms", "command": "get_chat_created", "chat": email}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

// Set functions

export function dms_add_user(idToken) {
  var jsonObj = {"product": "dms", "command": "add_user", "idToken": idToken}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function dms_request_to_chat(email) {
  var jsonObj = {"product": "dms", "command": "request_to_chat", "requested": email}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function dms_send_message(chat, message) {
  var jsonObj = {"product": "dms", "command": "send_message", "chat": chat, "message": message}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

// Hybrid Functions

export function dms_in_chat(chat, data) {
  var jsonObj = {"product": "dms", "command": "in_chat", "chat": chat, "data": data}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function dms_typing(chat, data) {
  var jsonObj = {"product": "dms", "command": "typing", "chat": chat, "data": data}
  var jsonString = JSON.stringify(jsonObj);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

export function dms_last_read(chat) {
  var jsonObj = {"product": "dms", "command": "last_read", "chat": chat}
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
