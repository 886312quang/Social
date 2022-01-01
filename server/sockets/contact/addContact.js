const { emitNotifyToArray } = require("../../helpers/socketHelper");

let addContact = (io, data, clients, user) => {
  let notify = {
    message: `${user.userName} wants to add you to the contacts`,
    avatar: user.avatar,
    userName: user.userName,
    _id: user._id,
  };
  // emit Data
  if (clients[data._id]) {
    emitNotifyToArray(
      clients,
      data._id,
      io,
      "response-add-contact",
      notify,
    );
  }
};

module.exports = addContact;
