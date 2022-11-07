const authControllers = require("./auth");
const userControllers = require("./user");
const contactControllers = require("./contact");
const messageControllers = require("./messages");
const groupControllers = require('./group');
const postControllers = require('./post');
const commentControllers = require('./comment');
const notificationControllers = require('./notification');

const auth = authControllers;
const user = userControllers;
const contact = contactControllers;
const messages = messageControllers;
const group  = groupControllers ;
const post  = postControllers ;
const notify = notificationControllers;
const comment = commentControllers;

module.exports = {
  auth,
  user,
  contact,
  messages,
  group,
  post,
  notify,
  comment
};
