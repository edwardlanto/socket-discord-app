const router = require("express").Router();
const roomsObj = require("../data/rooms");

router.get("/", (req, res) => {
  res.render("home", {
    title: "Homepage",
    style: "home.css",
    rooms: roomsObj.rooms,
    title: "Home"
  });
});

router.get("/chat", (req, res) => {
  res.render("chat", {
    title: "Chat",
    style: "chat.css",

    // Return only first letter for bottom icon
    firstLetter: () => {
      return req.query.username.charAt(0)
    },
    
    rooms: roomsObj.sliceTitle
  });
});

module.exports = router;
