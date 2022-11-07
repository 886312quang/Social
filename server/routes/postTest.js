const express = require("express");
const { post } = require("../controllers/index");
const AuthMiddleware = require("../middleware/auth");
const { messageValid } = require("../validation/index");

const router = express.Router();

//new post
router.route("/")
    .post(AuthMiddleware.isAuth, post.newPost);

//update post
router.route("/:id")
    .put(AuthMiddleware.isAuth, post.updatePost)
    .delete(AuthMiddleware.isAuth, post.deletePost)
    .get(post.getPost);

//like post
router.route("/like/:id")
    .put(AuthMiddleware.isAuth, post.likePost);

//get timeline
router.route("/timeline")
    .get(post.getTimeline);

module.exports = router;
