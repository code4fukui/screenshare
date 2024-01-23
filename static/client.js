const getWebSocketURL = () => {
  if (!location) return "ws://127.0.0.1:8000/";
  return (location.protocol == "http:" ? "ws://" : "wss://") + location.host;
};

const url = getWebSocketURL();
const websocket = new WebSocket(url);
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
