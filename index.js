const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Load express handlebars
const handlebars = require("express-handlebars");

app.enable("view cache");

app.engine(
  "hbs",
  handlebars({

    // Set extenstion to shorten handlebars keyword
    extname: ".hbs",
    defaultLayout: "main"
  })
);

// Use handlebars templating engine
app.set("view engine", "hbs");

app.get("/", (req, res) => {

  //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
  res.render("main", { layout: "home" });
});

const botName = "ChatCord Bot";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    // Every socket is unique so the id of socket is set as user id along with username and room passed from query params.
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Emits welcome message and formats it
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // broadcast method broadcasts all users in the room except self
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send ALL users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for socket with params 'chatMessage'
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
  console.log('Caught exception: ', err);
});


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
