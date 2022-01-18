const express = require("express");

// Routes
const auth = require("./auth");
const user = require("./user");
const contact = require("./contact");
const messages = require("./messages");
const group = require("./group");
const post = require("./post");
const notify = require("./notification");

const router = express.Router();

router.get("/status", (req, res) => res.send("OK"));

router.use("/auth", auth);
router.use("/user", user);
router.use("/contact", contact);
router.use("/message", messages);
router.use("/group", group);
router.use("/post", post);
router.use("/notification", notify);

module.exports = router;
