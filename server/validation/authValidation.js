const { check } = require("express-validator/check");
const { transValidation } = require("./../../lang/vi");

let register = [
  check("email", transValidation.email_incorrect).isEmail().trim(),
  check("gender", transValidation.gender_incorrect).isIn(["male", "female"]),
  check("password", transValidation.password_incorrect).isLength({ min: 8 }),
  check(
    "confirmPassword",
    transValidation.password_confirmation_incorrect,
  ).custom((value, { req }) => {
    return value === req.body.password;
  }),
];

let login = [
  check("email", transValidation.email_incorrect).isEmail().trim(),
  check("password", transValidation.password_incorrect).isLength({ min: 8 }),
];

let sendResetPassword = [
  check("email", transValidation.email_incorrect).isEmail().trim(),
];
let resetPassword = [
  check("email", transValidation.email_incorrect).isEmail().trim(),
  check("password", transValidation.password_incorrect).isLength({ min: 8 }),
];

module.exports = {
  register,
  login,
  sendResetPassword,
  resetPassword,
};
