const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage } = require("./utils/messages");

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

  socket.emit("message", generateMessage("Welcome!"));
  // send message to everybody except the current user
  socket.broadcast.emit("message", generateMessage("A new user has joined!"));

  socket.on("sendMessage", (message, cb) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return cb("Profanity is not allowed!");
    }

    // emit message to everyone
    io.emit("message", generateMessage(message));
    cb();
  });

  socket.on("sendLocation", (coordinates, cb) => {
    io.emit(
      "locationMessage",
      `https://google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`
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
