const express = require("express");
const AuthMiddleware = require("../middleware/auth");
const { group } = require("../controllers/index");

const router = express.Router();

router.route("/add-new").post(AuthMiddleware.isAuth, group.addNew);
router
  .route("/member")
  .patch(AuthMiddleware.isAuth, group.addMember)
  .delete(AuthMiddleware.isAuth, group.removeMember);

router
  .route("/avatar/:chatGroupId")
  .post(AuthMiddleware.isAuth, group.updateAvatar);
router.route("/").put(AuthMiddleware.isAuth, group.updateInfo);

module.exports = router;
