const express = require("express");

const { user } = require("../controllers/index");
const { userValid } = require("../validation/index");
const AuthMiddleware = require("../middleware/auth");

const router = express.Router();

router.param("userId", user.load);

// Get current user
router.route("/current").get(AuthMiddleware.isAuth, user.getCurrentUser);

// Update user
router
  .route("/updatePassword")
  .put(AuthMiddleware.isAuth, userValid.updatePassword, user.updatePassword);
router.route("/").put(AuthMiddleware.isAuth, user.updateInfo);
router.route("/updateAvatar").post(AuthMiddleware.isAuth, user.updateAvatar);

router.route("/iceServerList").get(AuthMiddleware.isAuth, user.iceServersList);

//follow a user
router.route("/follow/:id").get(AuthMiddleware.isAuth, user.follow);
//unfollow a user
router.route("/unfollow/:id").get(AuthMiddleware.isAuth, user.unfollow);

module.exports = router;
