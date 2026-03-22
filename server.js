const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let users = {};
let bannedUsers = [];

io.on("connection", (socket) => {

  socket.on("login", (data) => {
    if (bannedUsers.includes(data.username)) {
      socket.emit("banned");
      return;
    }

    users[socket.id] = data.username;
    socket.username = data.username;

    io.emit("message", {
      user: "System",
      text: data.username + " joined the chat"
    });
  });

  socket.on("sendMessage", (msg) => {
    io.emit("message", msg);
  });

  socket.on("deleteMessage", (id) => {
    if (socket.username === "Ray") {
      io.emit("deleteMessage", id);
    }
  });

  socket.on("banUser", (username) => {
    if (socket.username === "Ray") {
      bannedUsers.push(username);
      io.emit("message", { user: "System", text: username + " was banned" });
    }
  });

  socket.on("announcement", (text) => {
    if (socket.username === "Ray") {
      io.emit("announcement", text);
    }
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
  });

});

http.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
