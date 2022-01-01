const authValidation = require("./authValidation");
const userValidation = require("./userValidation");
const contactValidation = require("./contactValidation");
const messageValidation = require("./messageValidation");

module.exports = {
  authValid: authValidation,
  userValid: userValidation,
  contactValid: contactValidation,
  messageValid: messageValidation,
};
