const { emitNotifyToArray } = require("../../helpers/socketHelper");

let listenerEmitPeerId = (io, data, clients, user) => {
  if (clients[data.caller.id]) {
    // Step05: send peerId caller
    console.log(data);
    emitNotifyToArray(
      clients,
      data.caller.id,
      io,
      "server-caller-listener-peer-id",
      data,
    );
  }
};
module.exports = listenerEmitPeerId;
