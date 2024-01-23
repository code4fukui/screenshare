export const handleWebSocket = (socket) => {
  socket.onopen = () => {
    console.log("CONNECTED");
  };
  socket.onmessage = (event) => {
    console.log(`RECEIVED: ${event.data}`);
    socket.send("pong");
  };
  socket.onclose = () => console.log("DISCONNECTED");
  socket.onerror = (error) => console.error("ERROR:", error);
};
