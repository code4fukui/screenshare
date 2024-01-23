import { createWebSocket } from "./createWebSocket.js";

const websocket = createWebSocket();
let pingInterval;

function writeToScreen(message) {
  console.log(message);
}

function sendMessage(message) {
  writeToScreen(`SENT: ${message}`);
  websocket.send(message);
}

websocket.onopen = (e) => {
  writeToScreen("CONNECTED");
  sendMessage("ping");
  pingInterval = setInterval(() => {
    sendMessage("ping");
  }, 1000);
};

websocket.onclose = (e) => {
  writeToScreen("DISCONNECTED");
  clearInterval(pingInterval);
};

websocket.onmessage = (e) => {
  writeToScreen(`RECEIVED: ${e.data}`);
};

websocket.onerror = (e) => {
  writeToScreen(`ERROR: ${e.data}`);
};
