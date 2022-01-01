const express = require("express");
const AuthMiddleware = require("../middleware/auth");
const { group } = require("../controllers/index");

const router = express.Router();

router.route("/create-group").post(AuthMiddleware.isAuth, group.addNew);
router
  .route("/member")
  .patch(AuthMiddleware.isAuth, group.addMember)
  .delete(AuthMiddleware.isAuth, group.removeMember);

router
  .route("/coverPic/:groupId")
  .post(AuthMiddleware.isAuth, group.updateAvatar);
router.route("/").put(AuthMiddleware.isAuth, group.updateInfo);

router
  .route("/review/:postId")
  .post(AuthMiddleware.isAuth, group.updateAvatar);
router.route("/").put(AuthMiddleware.isAuth, group.updateInfo);

module.exports = router;
