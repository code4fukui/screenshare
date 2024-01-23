import { handleWeb } from "https://code4fukui.github.io/wsutil/handleWeb.js";
import { handleWS } from "./handleWS.js";

const port = Deno.args[0] || 8000;

Deno.serve({
  port,
  handler: async (request, info) => {
    if (request.headers.get("upgrade") === "websocket") {
      const { socket, response } = Deno.upgradeWebSocket(request);
      handleWS(socket);
      return response;
    } else {
      const path = new URL(request.url).pathname;
      return handleWeb("static", request, path, info);
    }
  },
});
