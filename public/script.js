const socket = io();
const username = localStorage.getItem("username");

socket.emit("login", { username });

function send() {
  let text = document.getElementById("message").value;

  socket.emit("sendMessage", {
    user: username,
    text: text,
    id: Date.now()
  });
}

socket.on("message", (msg) => {
  let div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<b>${msg.user}:</b> ${msg.text}`;
  document.getElementById("chat").appendChild(div);
});

socket.on("announcement", (text) => {
  document.getElementById("announcement").innerText = text;
});
