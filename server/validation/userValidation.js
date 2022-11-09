const { check } = require("express-validator/check");
const { transValidation } = require("./../../lang/vi");

let updateInfo = [
  check("userName", transValidation.update_userName)
    .optional()
    .isLength({ min: 3, max: 20 }),
];

let updatePassword = [
  check("currentPassword", transValidation.password_incorrect).isLength({
    min: 8,
  }),
  check("newPassword", transValidation.password_incorrect).isLength({ min: 8 }),
  check("confirm", transValidation.password_confirmation_incorrect).custom(
    (value, { req }) => value === req.body.newPassword,
  ),
];

module.exports = {
  updateInfo: updateInfo,
  updatePassword: updatePassword,
};
