class Group {
  name;
  cam = null;
  running = false;
  clients = [];
  constructor(name) {
    this.name = name;
  }
};

const groups = {};
const getGroup = (name) => {
  if (!name) name = "default"
  const g = groups[name];
  if (g) return g;
  const g2 = groups[name] = new Group(name);
  return g2;
};

export const handleWebSocket = (socket) => {
  socket.onopen = () => {
    console.log("CONNECTED");
  };
  socket.onmessage = (event) => {
    const data = event.data;
    const g = getGroup(data.group);
    if (!g) return;
    const t = data.type;
    //console.log(data, t);
    console.log(g.name, t);
    if (t == "init_cam") {
      if (g.cam) {
        try {
          g.cam.send({ type: "end_cam" });
        } catch (e) {
        }
      }
      g.cam = socket;
    } else if (t == "init_client") {
      if (g.cam && !g.running) {
        g.cam.send({ type: "start_cam" });
        console.log("start cam");
        g.running = true;
      }
      g.clients.push(socket);
    } else if (t == "cam_image") {
      console.log("img transfer", g.clients.length);
      g.clients.forEach(i => {
        try {
          i.send({ type: "cam_image", img: data.img });
        } catch (e) {
        }
      });
    }
  };
  socket.onclose = () => {
    A: for (const name in groups) {
      const g = groups[name];
      for (let i = 0; i < g.clients.length; i++) {
        if (g.clients[i] == socket) {
          g.clients.splice(i, 1);
          if (g.clients.length == 0) {
            if (g.running) {
              g.running = false;
              g.cam.send({ type: "stop_cam" });
              console.log("stop cam");
            }
          }
          break A;
        }
      }
    }
    console.log("DISCONNECTED");
  };
  socket.onerror = (error) => console.error("ERROR:", error);
};
