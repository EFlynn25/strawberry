import firebase from 'firebase/app';
import { useDispatch } from 'react-redux'
import { setdmsLoaded, setgroupsLoaded, setpeopleLoaded, setSocket, setAnnouncement, setAnnouncementRead } from './redux/appReducer.js'
import { setMultipleTabs } from './redux/appReducer.js'
import { addChat, addChatMessage, addLoadedChatMessages, removeSendingChatMessage, setChatCreated, setChatLastRead, setChatTyping, setInChat, setLoadingMessages, addChatRequest, removeChatRequest
  // removeRequesting, addRequested, addRequestedMe
} from './redux/dmsReducer.js'
import {
  setOpenedThread, addThread, removeThread, setThreadName, addThreadPeople, removeThreadPerson, addThreadMessage, addLoadedThreadMessages, removeSendingThreadMessage,
  removeThreadCreating, addThreadCreated,
  setThreadCreated, setThreadTyping, setInThread, setThreadLastRead,
  addThreadRequest, removeThreadRequest,
  addRequested, removeRequested
} from './redux/groupsReducer.js'
import { addPerson } from './redux/peopleReducer.js'
import mainStore from './redux/mainStore.js';
import history from "./history";

// import textToneAudio from './assets/audio/text-tone.mp3';

// Socket start

let socket = null;
// const textTone = new Audio(textToneAudio);

export function startSocket() {
  // socket = new WebSocket('wss://strawberry.neonblacknetwork.com:2096');
  socket = new WebSocket('wss://strawberry.neonblacknetwork.com:2053');

  setTimeout(function() {
    if (socket.readyState == 0) {
      socket.close();
    }
  }, 5000);

  socket.onmessage = function(event) {
    console.log("WebSocket message received: ", event);
    var jsonData = JSON.parse(event.data);
    var product = jsonData.product;
    var com = jsonData.command;
    const myEmail = mainStore.getState().app.email;
    if (product == "app") {


      if (com == "multiple_tabs") {
        mainStore.dispatch(setMultipleTabs(jsonData["data"]));
        console.log("multiple");
      }


      /* Get functions */
      else if (com == "get_user_info") {

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

        // if (Object.keys(mainStore.getState().people.knownPeople).includes(jsonData.email)) {
        //   mainStore.dispatch(setpersonName({"email": jsonData.email, "name": jsonData.name}))
        // } else {
        // }
        mainStore.dispatch(addPerson({"email": jsonData.email, "name": jsonData.name, "picture": jsonData.picture}));

        // if (!mainStore.getState().app.peopleLoaded) {
        //   let missingPerson = false;
        //   const chatKeys = Object.keys(mainStore.getState().dms.chats);
        //   const threads = mainStore.getState().groups.threads;
        //   const people = Object.keys(mainStore.getState().people.knownPeople);
        //   chatKeys.forEach(item => {
        //     if (!people.includes(item)) {
        //       missingPerson = true;
        //     }
        //   });
        //   console.log(people);
        //   Object.keys(threads).forEach(item => {
        //     console.log(item);
        //     if (threads[item].people) {
        //       threads[item].people.forEach(item => {
        //         console.log(item);
        //         if (!people.includes(item)) {
        //           console.log("missing");
        //           missingPerson = true;
        //         }
        //       });
        //     } else {
        //       missingPerson = true;
        //     }
        //   });
        //   if (!missingPerson) {
        //     mainStore.dispatch(setpeopleLoaded(true));
        //   }
        // }
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
          // mainStore.dispatch(setpeopleLoaded(true));
          mainStore.dispatch(setdmsLoaded(true));
        }
      } else if (com == "get_messages") {
        if (jsonData.response == true) {

          // const myEmail = mainStore.getState().app.email;
          // let myMessages = jsonData.messages.reverse();
          let myMessages = jsonData.messages;
          myMessages.forEach((item, i) => {
            if (item.email == myEmail) {
              item.from = "me";
            } else {
              item.from = "them";
            }
            delete item.email;
          });
          mainStore.dispatch(addLoadedChatMessages({"chat": jsonData.chat, "messages": myMessages}));

        } else if (jsonData.response == "receive_message") {
            let myFrom = "them";
            const item = jsonData.message;
            mainStore.dispatch(addChatMessage({chat: jsonData.chat, message: item.message, from: myFrom, id: item.id, timestamp: item.timestamp}));

            const openedDM = mainStore.getState().dms.openedDM;
            const dmsOrGroups = mainStore.getState().app.dmsOrGroups;
            console.log(openedDM);
            console.log(dmsOrGroups);
            if (openedDM != jsonData.chat || dmsOrGroups != "dms") {
              console.log("NOTIFY NOW!!");
              // textTone.play();
            }
        } else if (jsonData.response == "no_messages") {
          dms_get_chat_created(jsonData.chat);
        }

        if (!mainStore.getState().app.dmsLoaded) {
          let missingMessages = false;
          const chats = mainStore.getState().dms.chats;
          const chatKeys = Object.keys(chats);
          chatKeys.map(item => {
            const myMessages = chats[item].messages;
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
          mainStore.dispatch(setChatCreated({chat: jsonData.chat, created: jsonData.created}));
        }
      }


      /* Set Functions */
      else if (com == "add_user") {
        dms_get_chats();
        dms_request_to_chat("get_requests");
      } else if (com == "request_to_chat") {
        if (jsonData.response === "receive_request") {
          mainStore.dispatch(addChatRequest({"type": "requests", "email": jsonData.requested}));
        } else {
          if (jsonData.response !== "no_requests") {
            mainStore.dispatch(addChatRequest({"type": jsonData.response, "email": jsonData.requested}));
            mainStore.dispatch(removeChatRequest({"type": "requesting", "email": jsonData.requested}));
            if (jsonData.response == "requested_me") {
              mainStore.dispatch(removeChatRequest({"type": "requests", "email": jsonData.requested}));
              const item = jsonData.chat;
              get_chat_info(item);
            }
          }
        }
      } else if (com == "deny_request") {
        if (jsonData.response == true) {
          mainStore.dispatch(removeChatRequest({"type": "requests", "email": jsonData.requested}));
        } else if (jsonData.response == "receive_denied_request") {
          mainStore.dispatch(removeChatRequest({"type": "requested", "email": jsonData.requested}));
        }
      } else if (com == "send_message") {
        const myMessage = jsonData.message;
        mainStore.dispatch(removeSendingChatMessage({"chat": jsonData.chat, "message": jsonData.message.message}));
        mainStore.dispatch(addChatMessage({chat: jsonData.chat, message: myMessage.message, from: "me", id: myMessage.id, timestamp: myMessage.timestamp}));
      }


      /* Hybrid Functions */
      else if (com == "in_chat") {
        if (myEmail != jsonData.email) {
          mainStore.dispatch(setInChat({"chat": jsonData.chat, "data": jsonData.data}));
        }
        if ("lastRead" in jsonData) {
          if (myEmail != jsonData.email) {
            mainStore.dispatch(setChatLastRead({"who": "them", "chat": jsonData.chat, "lastRead": jsonData.lastRead}));
          } else if (myEmail == jsonData.email) {
            mainStore.dispatch(setChatLastRead({"who": "me", "chat": jsonData.chat, "lastRead": jsonData.lastRead}));
          }
        } else if (!("lastRead" in jsonData) && !jsonData.data && jsonData.response != "get_in_chat") {
          const myMessages = mainStore.getState().dms.chats[jsonData.chat].messages;
          if (myMessages != null && myMessages.length > 0) {
            mainStore.dispatch(setChatLastRead({"who": "them", "chat": jsonData.chat, "lastRead": myMessages[myMessages.length - 1].id}));
          }
        }
      } else if (com == "typing") {
        // mainStore.dispatch(setChatLastRead({"who": "me", "chat": jsonData.chat, "lastRead": jsonData.me}));
        // mainStore.dispatch(setChatLastRead({"who": "them", "chat": jsonData.chat, "lastRead": jsonData.them}));
        if (myEmail != jsonData.email) {
          mainStore.dispatch(setChatTyping({"chat": jsonData.chat, "data": jsonData.data}));
        }
      } else if (com == "last_read") {
        mainStore.dispatch(setChatLastRead({"who": "me", "chat": jsonData.chat, "lastRead": jsonData.me}));
        mainStore.dispatch(setChatLastRead({"who": "them", "chat": jsonData.chat, "lastRead": jsonData.them}));
      }


    } else if (product == "groups") {


      /* Get functions */
      if (com == "get_threads") {
        if (jsonData.response == true) {
          const threadsList = jsonData.threads;
          threadsList.map(item => {
            get_thread_info(item);
          });
        } else if (jsonData.response == "no_threads") {
          mainStore.dispatch(setgroupsLoaded(true));
        }
      } else if (com == "get_thread_info") {
        if (jsonData.response == true && jsonData.requested.includes(myEmail)) {
          mainStore.dispatch(addThreadRequest({[jsonData.thread_id]: {"name": jsonData.name, "people": jsonData.people}}));
        } else if (jsonData.response == true) {
          mainStore.dispatch(setThreadName({"thread_id": jsonData.thread_id, "new_name": jsonData.name}));
          mainStore.dispatch(addRequested({"thread_id": jsonData.thread_id, "people": jsonData.requested}));
          if (jsonData.people != null) {
            mainStore.dispatch(addThreadPeople({"thread_id": jsonData.thread_id, "people": jsonData.people}));
            const people = Object.keys(mainStore.getState().people.knownPeople);
            jsonData.people.forEach(item => {
              if (!people.includes(item)) {
                // mainStore.dispatch(addPerson({"email": item, "name": item, "picture": "/assets/images/default_profile_pic.png"}));
                get_user_info(item);
              }
            });
            console.log(people);
            // get_user_info();
          }
        }
      } else if (com == "get_messages") {
        if (jsonData.response == true) {

          // const myEmail = mainStore.getState().app.email;
          // let myMessages = jsonData.messages.reverse();
          let myMessages = jsonData.messages;
          myMessages.forEach((item, i) => {
            item.from = item.email;
            delete item.email;
          });
          mainStore.dispatch(addLoadedThreadMessages({"thread_id": jsonData.thread_id, "messages": myMessages}));

        } else if (jsonData.response == "receive_message") {
            const item = jsonData.message;
            mainStore.dispatch(addThreadMessage({thread_id: jsonData.thread_id, message: item.message, from: item.email, id: item.id, timestamp: item.timestamp}));

            const openedThread = mainStore.getState().groups.openedThread;
            const dmsOrGroups = mainStore.getState().app.dmsOrGroups;
            if (openedThread != jsonData.thread_id || dmsOrGroups != "groups") {
              // textTone.play();
            }
        } else if (jsonData.response == "no_messages") {
          dms_get_thread_created(jsonData.thread_id);
        }

        if (!mainStore.getState().app.groupsLoaded) {
          let missingMessages = false;
          const threads = mainStore.getState().groups.threads;
          const threadKeys = Object.keys(threads);
          threadKeys.map(item => {
            const myMessages = threads[item].messages;
            if (myMessages == null) {
              missingMessages = true;
            }
          });
          if (!missingMessages || jsonData.response == "no_messages") {
            mainStore.dispatch(setgroupsLoaded(true));
          }
        }

      } else if (com == "get_thread_created") {
        if (jsonData.response == true) {
          mainStore.dispatch(setThreadCreated({thread: jsonData.thread, created: jsonData.created}));
        }
      }


      /* Set functions */
      else if (com == "add_user") {
        groups_get_threads();
        groups_request_to_thread("get_requests", 0);
      }
      else if (com == "create_thread") {
        if (jsonData.response == true) {
          mainStore.dispatch(removeThreadCreating(jsonData.name));
          mainStore.dispatch(addThreadCreated(jsonData.name));
          // mainStore.dispatch(addThread(jsonData.thread));
          get_thread_info(jsonData.thread);
        }
      } else if (com == "rename_thread") {
        console.log(jsonData);
        mainStore.dispatch(setThreadName({"thread_id": jsonData.thread_id, "new_name": jsonData.new_name}));
      } else if (com == "send_message") {
        const myMessage = jsonData.message;
        mainStore.dispatch(removeSendingThreadMessage({"thread_id": jsonData.thread_id, "message": jsonData.message.message}));
        mainStore.dispatch(addThreadMessage({thread_id: jsonData.thread_id, message: myMessage.message, from: myMessage.email, id: myMessage.id, timestamp: myMessage.timestamp}));
      } else if (com == "request_to_thread") {
        if (jsonData.response === "receive_request") {
          jsonData.thread_id.forEach((item, i) => {
            groups_get_thread_info(item);
          });
        } else if (jsonData.response == true || jsonData.response == "receive_requested_person") {
          mainStore.dispatch(addRequested({thread_id: jsonData.thread_id, people: [jsonData.person]}))
        }
      } else if (com == "join_thread") {
        if (jsonData.response == true) {
          if (Object.keys(mainStore.getState().groups.requests).includes(jsonData.thread_id.toString())) {
            mainStore.dispatch(removeThreadRequest(jsonData.thread_id));
          }
          get_thread_info(jsonData.thread_id)
        } else if (jsonData.response == "receive_joined_person") {
          mainStore.dispatch(addThreadPeople({thread_id: jsonData.thread_id, people: [jsonData.person]}))
          mainStore.dispatch(removeRequested({thread_id: jsonData.thread_id, people: [jsonData.person]}))
          if (!Object.keys(mainStore.getState().people.knownPeople).includes(jsonData.person)) {
            // mainStore.dispatch(addPerson({"email": jsonData.person, "name": jsonData.person, "picture": "/assets/images/default_profile_pic.png"}));
            get_user_info(jsonData.person)
          }
        }
      } else if (com == "deny_request") {
        // console.log(Object.keys(mainStore.getState().groups.requests));
        // console.log(jsonData.thread_id);
        if (Object.keys(mainStore.getState().groups.requests).includes(jsonData.thread_id.toString())) {
          mainStore.dispatch(removeThreadRequest(jsonData.thread_id));
        } else if (jsonData.response == true || jsonData.response == "receive_denied_request") {
          mainStore.dispatch(removeRequested({thread_id: jsonData.thread_id, people: [jsonData.person]}))
        }
      } else if (com == "remove_person") {
        if (jsonData.response == true || jsonData.response == "receive_removed_person") {
          if (jsonData.person == myEmail) {
            // mainStore.dispatch(setOpenedThread(""));
            // history.push("/groups");
            mainStore.dispatch(removeThread(jsonData.thread_id));
          } else {
            mainStore.dispatch(removeThreadPerson({thread_id: jsonData.thread_id, person: jsonData.person}));
          }
        }
      }


      /* Hybrid functions */

      else if (com == "in_thread") {
        if (jsonData.response == true) {
          // do nothing
        } else if (jsonData.response == "receive_in_thread") {
          mainStore.dispatch(setInThread({"thread_id": jsonData.thread_id, "people": jsonData.in_thread, "data": jsonData.data}));
          if (jsonData.data === false && jsonData.lastRead != null) {
            let myLastReadDict = {};
            myLastReadDict[jsonData.in_thread] = jsonData.lastRead;
            mainStore.dispatch(setThreadLastRead({"thread_id": jsonData.thread_id, "last_read": myLastReadDict}));
          }
          if (jsonData.lastRead == null) {
            const myMessages = mainStore.getState().groups.threads[jsonData.thread_id].messages;
            if (myMessages != null && myMessages.length > 0) {
              let myLastReadDict = {};
              myLastReadDict[jsonData.in_thread] = myMessages[myMessages.length - 1].id;
              mainStore.dispatch(setThreadLastRead({"thread_id": jsonData.thread_id, "last_read": myLastReadDict}));
            }
          }
        } else if (jsonData.response == "get_in_thread") {
          if (jsonData.in_thread != null) {
            mainStore.dispatch(setInThread({"thread_id": jsonData.thread_id, "people": jsonData.in_thread, "data": jsonData.data}));
          }
        }
      } else if (com == "typing") {
        if (myEmail != jsonData.email && jsonData.typing != null) {
          mainStore.dispatch(setThreadTyping({"thread_id": jsonData.thread_id, "people": jsonData.typing, "data": jsonData.data}));
        }
      } else if (com == "last_read") {
        mainStore.dispatch(setThreadLastRead({"thread_id": jsonData.thread_id, "last_read": jsonData.last_read}));
      }


    }


  }

  socket.onopen = function(event) {
    console.log("WebSocket is open now");
    firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
      add_user(idToken);
      dms_add_user(idToken);
      groups_add_user(idToken);
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
  dms_get_messages(chat, "latest", 5);
  dms_in_chat(chat, "get_in_chat");
  dms_last_read(chat);
}

function get_thread_info(thread_id) {
  groups_get_thread_info(thread_id);
  mainStore.dispatch(addThread(thread_id));
  groups_get_messages(thread_id, "latest", 5);
  groups_in_thread(thread_id, "get_in_thread");
  groups_last_read(thread_id);
}

function send_websocket_message(jsonData) {
  var jsonString = JSON.stringify(jsonData);
  console.log("WebSocket message sending: " + jsonString);
  socket.send(jsonString);
}

// App Functions

// Get functions

export function get_user_info(requested) {
  var jsonObj = {"product": "app", "command": "get_user_info", "requested": requested}
  send_websocket_message(jsonObj);
}

export function get_announcements() {
  var jsonObj = {"product": "app", "command": "get_announcements"}
  send_websocket_message(jsonObj);
}

// Set functions

export function add_user(idToken) {
  var jsonObj = {"product": "app", "command": "add_user", "idToken": idToken}
  send_websocket_message(jsonObj);
}

export function add_announcement(id, title, content) {
  var jsonObj = {"product": "app", "command": "add_announcement", "id": id, "title": title, "content": content}
  send_websocket_message(jsonObj);
}

export function set_announcement_read(ids) {
  var jsonObj = {"product": "app", "command": "set_announcement_read", "ids": ids}
  send_websocket_message(jsonObj);
}



// DMS Functions

// Get functions

export function dms_get_chats() {
  var jsonObj = {"product": "dms", "command": "get_chats"}
  send_websocket_message(jsonObj);
}

export function dms_get_messages(email, id, amount) {
  var jsonObj = {"product": "dms", "command": "get_messages", "chat": email, "id": id, "amount": amount}
  send_websocket_message(jsonObj);
}

export function dms_get_chat_created(email) {
  var jsonObj = {"product": "dms", "command": "get_chat_created", "chat": email}
  send_websocket_message(jsonObj);
}

// Set functions

export function dms_add_user(idToken) {
  var jsonObj = {"product": "dms", "command": "add_user", "idToken": idToken}
  send_websocket_message(jsonObj);
}

export function dms_request_to_chat(email) {
  var jsonObj = {"product": "dms", "command": "request_to_chat", "requested": email}
  send_websocket_message(jsonObj);
}

export function dms_deny_request(email) {
  var jsonObj = {"product": "dms", "command": "deny_request", "requested": email}
  send_websocket_message(jsonObj);
}

export function dms_send_message(chat, message) {
  var jsonObj = {"product": "dms", "command": "send_message", "chat": chat, "message": message}
  send_websocket_message(jsonObj);
}

// Hybrid Functions

export function dms_in_chat(chat, data) {
  var jsonObj = {"product": "dms", "command": "in_chat", "chat": chat, "data": data}
  send_websocket_message(jsonObj);
}

export function dms_typing(chat, data) {
  var jsonObj = {"product": "dms", "command": "typing", "chat": chat, "data": data}
  send_websocket_message(jsonObj);
}

export function dms_last_read(chat) {
  var jsonObj = {"product": "dms", "command": "last_read", "chat": chat}
  send_websocket_message(jsonObj);
}



// Groups Functions

// Get functions

export function groups_get_threads() {
  var jsonObj = {"product": "groups", "command": "get_threads"}
  send_websocket_message(jsonObj);
}

export function groups_get_thread_info(thread_id) {
  var jsonObj = {"product": "groups", "command": "get_thread_info", "thread_id": thread_id}
  send_websocket_message(jsonObj);
}

export function groups_get_messages(thread_id, id, amount) {
  var jsonObj = {"product": "groups", "command": "get_messages", "thread_id": thread_id, "id": id, "amount": amount}
  send_websocket_message(jsonObj);
}

export function dms_get_thread_created(thread_id) {
  var jsonObj = {"product": "groups", "command": "get_thread_created", "thread_id": thread_id}
  send_websocket_message(jsonObj);
}






// Set functions

export function groups_add_user(idToken) {
  var jsonObj = {"product": "groups", "command": "add_user", "idToken": idToken}
  send_websocket_message(jsonObj);
}

export function groups_create_thread(name, people) {
  var jsonObj = {"product": "groups", "command": "create_thread", "name": name, "people": people}
  send_websocket_message(jsonObj);
}

export function groups_rename_thread(thread_id, new_name) {
  var jsonObj = {"product": "groups", "command": "rename_thread", "thread_id": thread_id, "new_name": new_name}
  send_websocket_message(jsonObj);
}

export function groups_request_to_thread(email, thread_id) {
  var jsonObj = {"product": "groups", "command": "request_to_thread", "requested": email, "thread_id": thread_id}
  send_websocket_message(jsonObj);
}

export function groups_join_thread(thread_id) {
  var jsonObj = {"product": "groups", "command": "join_thread", "thread_id": thread_id}
  send_websocket_message(jsonObj);
}

export function groups_get_requests() {
  var jsonObj = {"product": "groups", "command": "get_requests"}
  send_websocket_message(jsonObj);
}

export function groups_leave_thread(thread_id) {
  var jsonObj = {"product": "groups", "command": "leave_thread", "thread_id": thread_id}
  send_websocket_message(jsonObj);
}

export function groups_deny_request(thread_id, unrequesting = null) {
  // var jsonObj = {"product": "groups", "command": "deny_request", "thread_id": thread_id}
  // if (unrequesting != null) {
  //   jsonObj["unrequesting"] = unrequesting;
  // }
  var jsonObj = {"product": "groups", "command": "deny_request", "thread_id": thread_id, "unrequesting": unrequesting}
  send_websocket_message(jsonObj);
}

export function groups_remove_person(thread_id, person) {
  var jsonObj = {"product": "groups", "command": "remove_person", "thread_id": thread_id, "person": person}
  send_websocket_message(jsonObj);
}

export function groups_send_message(thread_id, message) {
  var jsonObj = {"product": "groups", "command": "send_message", "message": message, "thread_id": thread_id}
  send_websocket_message(jsonObj);
}

// export function groups_rename_thread(thread_id, name) {
//   var jsonObj = {"product": "groups", "command": "rename_thread", "thread_id": thread_id, "name": name}
//   send_websocket_message(jsonObj);
// }

// export function groups_get_user_info(email) {
//   var jsonObj = {"product": "groups", "command": "get_user_info", "requested": email}
//   send_websocket_message(jsonObj);
// }

// export function groups_get_known_people() {
//   var jsonObj = {"product": "groups", "command": "get_known_people"}
//   send_websocket_message(jsonObj);
// }

export function groups_in_thread(thread_id, data) {
  var jsonObj = {"product": "groups", "command": "in_thread", "thread_id": thread_id, "data": data}
  send_websocket_message(jsonObj);
}

export function groups_typing(thread_id, data) {
  var jsonObj = {"product": "groups", "command": "typing", "thread_id": thread_id, "data": data}
  send_websocket_message(jsonObj);
}

export function groups_last_read(thread_id) {
  var jsonObj = {"product": "groups", "command": "last_read", "thread_id": thread_id}
  send_websocket_message(jsonObj);
}
