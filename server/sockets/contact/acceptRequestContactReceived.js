const { emitNotifyToArray } = require("../../helpers/socketHelper");

let acceptRequestContactReceived = (io, data, clients, user) => {
  let notify = {
    message: `${user.userName} has added you to the contacts`,
    avatar: user.avatar,
    userName: user.userName,
    _id: user._id,
    messages: [],
    updatedAt: Date.now(),
  };
  // emit Data
  if (clients[data.id]) {
    emitNotifyToArray(
      clients,
      data.id,
      io,
      "response-accept-request-contact-received",
      notify,
    );
  }
};

module.exports = acceptRequestContactReceived;
