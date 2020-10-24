const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const routes = require('./routes/handlers');
const formatMessage = require("./routes/utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./routes/utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Load express handlebars
const hb = require("express-handlebars");
require('dotenv').config()

// Serves assets in public folder with handlebars.
app.use(express.static('public'));

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use('/', routes);

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

process.on('exit', (code) => {
  io.socket.disconnect();
  io.socket.close();
  console.log(`Exiting ${code}`)
})


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
