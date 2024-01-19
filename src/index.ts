import express, { Request, Response } from "express";
import "dotenv/config";
import route from "./routers/index.route";
import { Server } from "socket.io";
import { createServer } from "http";
import { SocketRouteHandler } from "./sockets";
import { Message } from "./helper/mongodb";
import cors from "cors";

const PORT = 8000;
const app = express();
const httpserver = createServer(app);
const io = new Server(httpserver, { cors: { origin: "*" } });

SocketRouteHandler(io);
app.use(cors());
app.use(express.json());
app.get("/", (req: Request, res: Response) => res.send("Hello rld"));
app.get("/test", async (req: Request, res: Response) => {
  try {
    const msg = await Message.find({}).toArray();
    console.log(msg);
    res.send(msg);
  } catch (err) {
    console.log(err);
  }
});

app.use(route);

httpserver.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
