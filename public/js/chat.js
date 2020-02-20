const socket = io();

socket.on("message", message => {
  console.log(message);
});

const chatForm = document.querySelector("#message-form");
// if there is another input in the page it's not good. We need to use e.target
// const text = document.querySelector("input");

chatForm.addEventListener("submit", e => {
  e.preventDefault();

  //   let message = text.value;
  let message = e.target.elements.message.value;

  socket.emit("sendMessage", message);
  if (message == e.target.elements.message.value) {
    e.target.elements.message.value = "";
  }
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser...");
  }

  navigator.geolocation.getCurrentPosition(position => {
    const coordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };

    socket.emit("sendLocation", coordinates);
  });
});
