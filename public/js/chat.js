const socket = io();

// server (emiit) -> client (receive) --acknowledgement--> server

// client (emiit) -> server (receive) --acknowledgement--> client

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

  socket.emit("sendMessage", message, error => {
    if (error) {
      return console.log(error);
    }

    console.log("Message delivered!");
  });
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

    socket.emit("sendLocation", coordinates, () => {
      console.log("Location shared!");
    });
  });
});
