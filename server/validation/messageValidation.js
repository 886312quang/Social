const { check } = require("express-validator/check");
const { transValidation } = require("./../../lang/vi");

let checkMessageLength = [
  check("message", transValidation.message_text_emoji_incorrect).isLength({
    min: 1,
    max: 400,
  }),
];

module.exports = {
  checkMessageLength: checkMessageLength,
};
