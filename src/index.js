const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

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

  socket.emit("message", "Welcome!");
  // send message to everybody except the current user
  socket.broadcast.emit("message", "A new user has joined!");

  socket.on("sendMessage", message => {
    // emit message to everyone
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left!");
  });
});

server.listen(port, () => {
  console.log("Server is up on port " + port);
});
