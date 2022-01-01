const { emitNotifyToArray } = require("../../helpers/socketHelper");

let callerRequestCall = (io, data, clients, user) => {
  if (clients[data.listener.id]) {
    // Step8. send request call to listener
    emitNotifyToArray(
      clients,
      data.listener.id,
      io,
      "server-listener-request-call",
      data,
    );
  }
};
module.exports = callerRequestCall;
