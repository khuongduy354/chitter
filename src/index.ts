import express, { Request, Response } from "express";
import "dotenv/config";
import route from "./routers/index.route";
import { Server } from "socket.io";
import { createServer } from "http";
import { SocketRouteHandler } from "./sockets";

const PORT = 8000;
const app = express();
const httpserver = createServer(app);
const io = new Server(httpserver);

SocketRouteHandler(io);

app.get("/", (req: Request, res: Response) => res.send("Hello rld"));

app.use(route);

httpserver.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
