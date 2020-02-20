const socket = io();

// socket.on("countUpdated", count => {
//   console.log("The count has been updated", count);
// });

// document.querySelector("#increment").addEventListener("click", () => {
//   console.log("clicked");
//   socket.emit("increment");
// });

socket.on("message", message => {
  console.log(message);
});

const chatForm = document.querySelector("form");
const text = document.querySelector("input");

chatForm.addEventListener("submit", e => {
  e.preventDefault();

  let message = text.value;

  socket.emit("sendMessage", message);
  if (message == text.value) {
    text.value = "";
  }
});
