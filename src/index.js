const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
// socket need the raw http server (express does it in the background and we don't have access)
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

// server (emit) -> client (receive) -> countUpdated
// client (emit) -> server (receive) -> increment
io.on("connection", socket => {
  console.log("New WebSocket connection");

  socket.on("join", ({ username, room }) => {
    socket.join(room);

    // socket.emit, io.emit, socket.broadcast.emit
    // io.to.emit, socket.broadcast.to.emit

    socket.emit("message", generateMessage("Welcome!"));
    // send message to everybody except the current user
    socket.broadcast
      .to(room)
      .emit("message", generateMessage(`${username} has joined!`));
  });

  socket.on("sendMessage", (message, cb) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return cb("Profanity is not allowed!");
    }

    // emit message to everyone
    io.to("Paris").emit("message", generateMessage(message));
    cb();
  });

  socket.on("sendLocation", (coordinates, cb) => {
    io.emit(
      "locationMessage",
      generateLocationMessage(
        `https://google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`
      )
    );
    cb();
  });

  socket.on("disconnect", () => {
    io.emit("message", generateMessage("A user has left!"));
  });
});

server.listen(port, () => {
  console.log("Server is up on port " + port);
});
