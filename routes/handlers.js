const router = require("express").Router();
const rooms = require('../data/rooms');

router.get("/", (req, res) => {
  console.log('rooms', rooms);
  res.render("home", {
    title: "Homepage",
    style: "home.css",
    rooms: rooms
  });
});

router.get("/chat", (req, res) => {
  console.log(req.query.username)
  res.render("chat", {
    title: "Chat",
    style: "chat.css",
    helpers: {
      firstLetter: function () { return req.query.username.charAt(0); }
    }
  });
});

module.exports = router;
