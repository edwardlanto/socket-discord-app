const router = require('express').Router()

router.get("/", (req, res) => {
    res.render('home', {
        title: "Homepage",
        style: 'home.css'
    });
});

router.get("/chat", (req, res) => {
    res.render('chat', {
        title: "Chat",
        style: 'chat.css'
    });
});


module.exports = router;