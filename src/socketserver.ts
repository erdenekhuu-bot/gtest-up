import { createServer } from "http";
import next from "next";
import { WebSocketServer, WebSocket } from "ws";

const app = next({ dev:false });
const handle = app.getRequestHandler();

const clients = new Map<WebSocket, number>();

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));

  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const employeeId = Number(url.searchParams.get("employeeId") || 0);
    clients.set(ws, employeeId);

    ws.on("message", (msg: string) => {
      const data = JSON.parse(msg);
      if (data.action === "submitChange") {
        const senderId = clients.get(ws);
        console.log(`Employee ${senderId} submitted a change`);

        // broadcast to all clients
        const message = JSON.stringify({
          type: "update",
          employeeId: senderId,
          message: "submitted a change",
        });

        for (const client of clients.keys()) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        }
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
    });
  });

  const PORT = process.env.SOCKET_PORT;
  server.listen(PORT, () => console.log(`> Ready on http://${process.env.SOCKET_URL}`));
});
