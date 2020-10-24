const router = require("express").Router();
const { slice } = require("../data/rooms");
const rooms = require("../data/rooms");

function getList(){
  return rooms.map((item) => item.slice(0,3))
}

router.get("/", (req, res) => {
  res.render("home", {
    title: "Homepage",
    style: "home.css",
    rooms: rooms
  });
});

router.get("/chat", (req, res) => {
  console.log(req.query.username);
  res.render("chat", {
    title: "Chat",
    style: "chat.css",
    firstLetter: () => {
      return req.query.username.charAt(0);
    },
    threeLetterName: getList()
  });
});

module.exports = router;
