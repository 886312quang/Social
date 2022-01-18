const express = require("express");
const { notify } = require("../controllers/index");
const AuthMiddleware = require("../middleware/auth");

const router = express.Router();

router.route("/").get(AuthMiddleware.isAuth, notify.readMore);
// Mark notify
router
  .route("/mark-notify/:id")
  .put(AuthMiddleware.isAuth, notify.markNotify);

module.exports = router;
