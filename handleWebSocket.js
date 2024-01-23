let cam = null;
let running = false;
const clients = [];

export const handleWebSocket = (socket) => {
  socket.onopen = () => {
    console.log("CONNECTED");
  };
  socket.onmessage = (event) => {
    const data = event.data;
    const t = data.type;
    //console.log(data, t);
    console.log(t);
    if (t == "init_cam") {
      if (cam) {
        try {
          cam.send({ type: "end_cam" });
        } catch (e) {
        }
      }
      cam = socket;
    } else if (t == "init_client") {
      if (cam && !running) {
        cam.send({ type: "start_cam" });
        console.log("start cam");
        running = true;
      }
      clients.push(socket);
    } else if (t == "cam_image") {
      console.log("img transfer", clients.length);
      clients.forEach(i => {
        try {
          i.send({ type: "cam_image", img: data.img });
        } catch (e) {
        }
      });
    }
  };
  socket.onclose = () => {
    for (let i = 0; i < clients.length; i++) {
      if (clients[i] == socket) {
        clients.splice(i, 1);
        break;
      }
    }
    if (clients.length == 0) {
      if (running) {
        running = false;
        cam.send({ type: "stop_cam" });
        console.log("stop cam");
      }
    }
    console.log("DISCONNECTED");
  };
  socket.onerror = (error) => console.error("ERROR:", error);
};
