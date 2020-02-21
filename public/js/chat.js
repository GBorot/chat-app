const socket = io();

// server (emiit) -> client (receive) --acknowledgement--> server

// client (emiit) -> server (receive) --acknowledgement--> client

// Elements :
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = document.querySelector("input");
const $messageFormButton = document.querySelector("button");
const $geolocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const $messageTemplate = document.querySelector("#message-template").innerHTML;

socket.on("message", message => {
  console.log(message);

  const html = Mustache.render($messageTemplate, {
    message
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

// if there is another input in the page it's not good. We need to use e.target
// const text = document.querySelector("input");

$messageForm.addEventListener("submit", e => {
  e.preventDefault();
  // disable the form
  $messageFormButton.setAttribute("disabled", "disabled");

  //   let message = text.value;
  let message = e.target.elements.message.value;

  socket.emit("sendMessage", message, error => {
    // enable form
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log("Message delivered!");
  });
});

$geolocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser...");
  }
  // Disable
  $geolocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(position => {
    const coordinates = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };

    socket.emit("sendLocation", coordinates, () => {
      // Enable
      $geolocationButton.removeAttribute("disabled");
      console.log("Location shared!");
    });
  });
});
