const { validationResult } = require("express-validator/check");
const { auth } = require("./../services/index");
const UserModel = require("../models/userModel");
const { transSuccess, transErrors } = require("../../lang/vi");
const jwtHelper = require("../helpers/jwt.helper");
const PasswordResetToken = require("../models/passwordResetModel");
const emailProvider = require("../services/emails/emailProvider");
const moment = require("moment");
const bcrypt = require("bcrypt");
const {
  generateUniqueSecret,
  verifyOTPToken,
  generateOTPToken,
  generateQRCode,
} = require("../helpers/2fa.js");

const tokenList = [];
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "24h";
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "process.env.ACCESS_TOKEN_SECRET_MQ_9999";
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "24h";
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET ||
  "process.env.REFRESH_TOKEN_SECRET_MQ_9999";

let register = async (req, res) => {
  let errorArr = [];
  let successArr = [];
  let validationErr = validationResult(req);
  if (!validationErr.isEmpty()) {
    let errors = Object.values(validationErr.mapped());
    errors.forEach((item) => {
      errorArr.push(item.msg);
    });

    return res.status(401).send({ success: false, message: errorArr });
  }
  try {
    let createUserSuccess = await auth.register(
      req.body.fullname,
      req.body.email,
      req.body.gender,
      req.body.password,
      req.body.userName,
      req.protocol,
      req.get("host")
    );
    successArr.push(createUserSuccess);
    return res.status(200).json({ success: true, message: successArr });
  } catch (error) {
    return res.status(200).json({ success: false, message: error });
  }
};

let login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    if (password) {
      if (user) {
        let checkPassword = await user.comparePassword(password);
        if (checkPassword) {
          if (!user.local.isActive) {
            return res
              .status(401)
              .json({ message: transErrors.account_notActive });
          } else {
            const userData = {
              _id: user._id,
              userName: user.userName,
              email: user.local.email,
              avatar: user.avatar,
            };

            if (user.enable2FA) {
              const verify2FA = {
                verify2FA: false,
              };
              await user.updateOne(verify2FA);
            }

            // Token
            const accessToken = await jwtHelper.generateToken(
              userData,
              accessTokenSecret,
              accessTokenLife
            );
            const refreshToken = await jwtHelper.generateToken(
              userData,
              refreshTokenSecret,
              refreshTokenLife
            );

            const expToken = await jwtHelper.verifyToken(
              accessToken,
              accessTokenSecret
            );

            tokenList[refreshToken] = { accessToken, refreshToken };

            return res.status(200).json({
              accessToken,
              refreshToken,
              enable2FA: user.enable2FA,
              verify2FA: false,
              exp: expToken.exp,
              iat: expToken.iat,
              user: userData,
              message: transSuccess.loginSuccess(user.userName),
            });
          }
        } else {
          return res
            .status(401)
            .json({ message: "Incorrect email or password" });
        }
      }
    } else {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

let verifyEmailAccount = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(500).json({ success: false, message: "Verify Fail" });
    }

    let verifySuccess = await auth.verifyAccount(token);
    if (verifySuccess) {
      return res.status(200).json({ success: true, message: verifySuccess });
    }

    return res.status(500).json({ success: false, message: "Verify Fail" });
  } catch (error) {
    return res.status(500).send("Sever Error");
  }
};

let sendResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ "local.email": email }).exec();

    if (user) {
      const passwordResetObj = await PasswordResetToken.generate(user);

      emailProvider.sendPasswordReset(passwordResetObj);

      return res
        .status(200)
        .json({ message: "Send Email reset password success!" });
    }
    return res.status(401).json({ message: "Not found email!" });
  } catch (error) {
    return next(error);
  }
};

let resetPassword = async (req, res, next) => {
  try {
    const { email, password, resetToken } = req.body;

    const resetTokenObject = await PasswordResetToken.findOneAndRemove({
      userEmail: email,
      resetToken,
    });

    if (!resetTokenObject) {
      /* err.message = "Cannot find matching reset token";
      throw new APIError(err); */
      return res
        .status(401)
        .json({ success: false, message: "Cannot find matching reset token" });
    }
    if (moment().isAfter(resetTokenObject.expires)) {
      /* err.message = "Reset token is expired";
      throw new APIError(err); */

      return res
        .status(401)
        .json({ success: false, message: "Reset token is expired" });
    }

    const user = await UserModel.findOne({
      "local.email": resetTokenObject.userEmail,
    }).exec();

    if (!user) {
      return res.status(401).json({ message: "User error" });
    }

    let saltRounds = 7;
    let salt = bcrypt.genSaltSync(saltRounds);
    user.local.password = bcrypt.hashSync(password, salt);
    await user.save();
    emailProvider.sendPasswordChangeEmail(user);

    return res.status(200).json({ message: "Password Updated" });
  } catch (error) {
    return next(error);
  }
};

/**
 * controller refreshToken
 * @param {*} req
 * @param {*} res
 */
let refreshToken = async (req, res) => {
  const refreshTokenFromClient = req.body.refreshToken;

  if (refreshTokenFromClient && tokenList[refreshTokenFromClient]) {
    try {
      const decoded = await jwtHelper.verifyToken(
        refreshTokenFromClient,
        refreshTokenSecret
      );

      tokenList.filter((token) => token !== refreshTokenFromClient);

      const userData = decoded.data;

      const accessToken = await jwtHelper.generateToken(
        userData,
        accessTokenSecret,
        accessTokenLife
      );

      const refreshToken = await jwtHelper.generateToken(
        userData,
        refreshTokenSecret,
        refreshTokenLife
      );

      const expToken = await jwtHelper.verifyToken(
        accessToken,
        accessTokenSecret
      );

      tokenList[refreshToken] = { accessToken, refreshToken };

      return res.status(200).json({
        accessToken,
        refreshToken,
        exp: expToken.exp,
        iat: expToken.iat,
      });
    } catch (error) {
      res.status(403).json({
        message: "Invalid refresh token.",
      });
    }
  } else {
    return res.status(403).send({
      message: "No token provided.",
    });
  }
};

const postEnable2FA = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const serviceName = "mqsocial.com";
    // Thực hiện tạo mã OTP
    const otpAuth = generateOTPToken(user.userName, serviceName, user.secretKey);

    const QRCodeImage = await generateQRCode(otpAuth);
    
    return res.status(200).json({ QRCodeImage });
  } catch (error) {
    return res.status(500).json(error);
  }
};
const postVerify2FA = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const { otpToken } = req.body;
    // Kiểm tra mã token người dùng truyền lên có hợp lệ hay không?
    const isValid = verifyOTPToken(otpToken, user.secretKey);
    /** Sau bước này nếu verify thành công thì thực tế chúng ta sẽ redirect qua trang đăng nhập thành công,
    còn hiện tại demo thì mình sẽ trả về client là đã verify success hoặc fail */
    if (isValid) {
      if (user.enable2FA) {
        const verify2FA = {
          verify2FA: true,
        };
        await user.updateOne(verify2FA);
      }
    }
    return res.status(200).json({ isValid });
  } catch (error) {
    console.log(error)
    return res.status(500).json(error);
  }
};

let get2FA = async (req, res) => {
  const user = await UserModel.get2FA(req.user._id);

  return res.status(200).json(user);
};

module.exports = {
  register,
  login,
  verifyEmailAccount,
  sendResetPassword,
  resetPassword,
  refreshToken,
  postEnable2FA,
  postVerify2FA,
  get2FA,
};
