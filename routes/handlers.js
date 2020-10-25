const router = require("express").Router();
const rooms = require("../data/rooms");

router.get("/", (req, res) => {
  res.render("home", {
    title: "Homepage",
    style: "home.css",
    rooms: rooms
  });
});

router.get("/chat", (req, res) => {
  res.render("chat", {
    title: "Chat",
    style: "chat.css",
    firstLetter: () => {
      return req.query.username.charAt(0);
    },
    rooms: rooms.sliceTitle
  });
});

module.exports = router;
