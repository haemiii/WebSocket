import express from "express";
// import WebSocket from "ws";
import SocketIo from "socket.io";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

console.log("hello");

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app); //http 서버
const io = SocketIo(server); //socketio 서버

io.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done(); // callback function(front에서 보낸 함수!)
    socket.to(roomName).emit("welcome", socket.nickname); // 나를 제외하고 다른사람들에게 보냄!
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname);
    });
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });

  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });
});
// const wss = new WebSocket.Server({ server }); //webSocket 서버

// const sockets = [];
// wss.on("connection", (socket) => {
//   //백엔드와 연결한 각 브라우저를 위한 것
//   sockets.push(socket);
//   console.log("Connected to Browser ✅");
//   socket.on("close", () => console.log("Disconnected from the Browser"));
//   socket["nickname"] = "Anon";
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);
//     switch (message.type) {
//       case "new_message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}: ${message.payload}`)
//         );
//       case "nickname":
//         socket["nickname"] = message.payload;
//     }
//   });
// });

server.listen(3000, handleListen);
