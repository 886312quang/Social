const authServices = require("./authServices");
const userServices = require("./userServices");
const contactServices = require("./contactServices");
const notificationServices = require("./notificationService");
const messageServices = require("./messageServices");
const groupServices = require("./groupServices");
const groupsServices = require("./groupsServices");

module.exports = {
  auth: authServices,
  user: userServices,
  contact: contactServices,
  notification: notificationServices,
  message: messageServices,
  group: groupServices,
  groups: groupsServices,
};
