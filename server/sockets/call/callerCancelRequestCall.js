const { emitNotifyToArray } = require("../../helpers/socketHelper");

let callerRequestCall = (io, data, clients, user) => {
  if (clients[data.listener.id]) {
    // Step 09: send request cancel to listener
    emitNotifyToArray(
      clients,
      data.listener.id,
      io,
      "server-listener-cancel-request-call",
      data,
    );
  }
};
module.exports = callerRequestCall;
