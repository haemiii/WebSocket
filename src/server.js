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

function handleConnection(socket) {
  //연결된 브라우져
  console.log(socket);
}
wss.on("connection", handleConnection);

server.listen(3000, handleListen);
