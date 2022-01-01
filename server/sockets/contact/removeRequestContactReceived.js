const { emitNotifyToArray } = require("../../helpers/socketHelper");
/**
 * @param io from socket.io lib
 */
let removeRequestContactReceived = (io, data, clients, user) => {
  let notify = {
    _id: user._id,
  };
  // emit notifications
  if (clients[data]) { // data: id
    emitNotifyToArray(
      clients,
      data,
      io,
      "response-remove-request-contact-received",
      notify,
    );
  }
};

module.exports = removeRequestContactReceived;
