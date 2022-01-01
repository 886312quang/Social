const express = require("express");

const { auth } = require("./../controllers/index");
const {
  authValid,
  /* userValid,
    contactValid,
    messageValid, */
} = require("./../validation/index");

const router = express.Router();

router.route("/register").post(authValid.register, auth.register);
router.route("/login").post(authValid.login, auth.login);
router.route("/verify-email").post(auth.verifyEmailAccount);
router.route("/send-password-reset").post(authValid.sendResetPassword, auth.sendResetPassword);
router.route("/reset-password").post(authValid.resetPassword, auth.resetPassword);
router.route("/refresh-token").post(auth.refreshToken);

module.exports = router;
