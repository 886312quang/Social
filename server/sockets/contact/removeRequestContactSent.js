const { emitNotifyToArray } = require("../../helpers/socketHelper");
/**
 * @param io from socket.io lib
 */
let removeRequestContactSent = (io, data, clients, user) => {
  let notify = {
    _id: user._id,
  };
  // emit notifications
  if (clients[data]) { // data: id
    emitNotifyToArray(
      clients,
      data,
      io,
      "response-remove-request-sent-contact",
      notify,
    );
  }
};

module.exports = removeRequestContactSent;
