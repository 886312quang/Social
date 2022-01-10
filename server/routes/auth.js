const express = require("express");

const { auth } = require("./../controllers/index");
const {
  authValid,
  /* userValid,
    contactValid,
    messageValid, */
} = require("./../validation/index");
const AuthMiddleware = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(authValid.register, auth.register);
router.route("/login").post(authValid.login, auth.login);
router.route("/verify-email").post(auth.verifyEmailAccount);
router
  .route("/send-password-reset")
  .post(authValid.sendResetPassword, auth.sendResetPassword);
router
  .route("/reset-password")
  .post(authValid.resetPassword, auth.resetPassword);
router.route("/refresh-token").post(auth.refreshToken);

router.route("/2FA").get(AuthMiddleware.isAuth, auth.get2FA);
// Trang bật tính năng bảo mật 2 lớp
router.route("/enable-2fa").get(AuthMiddleware.isAuth, auth.postEnable2FA);
// Trang yêu cầu xác thực 2 lớp
router.route("/verify-2fa").post(AuthMiddleware.isAuth, auth.postVerify2FA);

module.exports = router;
