const express = require("express");
const { messages } = require("../controllers/index");
const AuthMiddleware = require("../middleware/auth");
const { messageValid } = require("../validation/index");

const router = express.Router();

router
  .route("/read-more-all-chat")
  .get(AuthMiddleware.isAuth, messages.readMoreAllChat);
router
  .route("/")
  .post(
    AuthMiddleware.isAuth,
    messageValid.checkMessageLength,
    messages.creatNewMessage,
  );

router.route("/photos").post(AuthMiddleware.isAuth, messages.addPhotos);
router
  .route("/add-new-images")
  .post(AuthMiddleware.isAuth, messages.addNewImage);

router.route("/files").post(AuthMiddleware.isAuth, messages.addFiles);
router
  .route("/add-new-files")
  .post(AuthMiddleware.isAuth, messages.addNewFiles);

router
  .route("/delete-list")
  .post(AuthMiddleware.isAuth, messages.deleteListImages);
router.route("/list").get(AuthMiddleware.isAuth, messages.listImage);
router.route("/listFile").get(AuthMiddleware.isAuth, messages.listFile);
// Read more
router.route("/read-more").get(AuthMiddleware.isAuth, messages.readMore);

module.exports = router;
