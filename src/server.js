import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.render("/"));

console.log("hello");

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app); //http 서버
const wss = new WebSocket.Server({ server }); //webSocket 서버

const sockets = [];
wss.on("connection", (socket) => {
  console.log(socket);
  //백엔드와 연결한 각 브라우저를 위한 것
  sockets.push(socket);
  console.log("Connected to Browser ✅");
  socket.on("close", () => console.log("Disconnected from the Browser"));
  socket.on("message", (message) => {
    sockets.forEach((aSocket) => aSocket.send(message.toString()));
  });
});

server.listen(3000, handleListen);
