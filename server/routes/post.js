const router = require("express").Router();
const post = require("../controllers/post");
const AuthMiddleware = require("../middleware/auth");

router.route("/").post(AuthMiddleware.isAuth, post.createPost).get(AuthMiddleware.isAuth, post.getPosts);

router
  .route("/:id")
  .patch(AuthMiddleware.isAuth, post.updatePost)
  .get(AuthMiddleware.isAuth, post.getPost)
  .delete(AuthMiddleware.isAuth, post.deletePost);

router.patch("/:id/like", AuthMiddleware.isAuth, post.likePost);

router.patch("/:id/unlike", AuthMiddleware.isAuth, post.unLikePost);

router.get("/user_posts/:id", AuthMiddleware.isAuth, post.getUserPosts);

router.get("/post_discover", AuthMiddleware.isAuth, post.getPostsDicover);

router.patch("/savePost/:id", AuthMiddleware.isAuth, post.savePost);

router.patch("/unSavePost/:id", AuthMiddleware.isAuth, post.unSavePost);

router.get("/getSavePosts", AuthMiddleware.isAuth, post.getSavePosts);

module.exports = router;
