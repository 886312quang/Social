const { emitNotifyToArray } = require("../../helpers/socketHelper");

let checkListenerStatus = (io, data, clients, user) => {
  // Step02: Return status listener to caller 
  emitNotifyToArray(
    clients,
    data.caller.id,
    io,
    "server-caller-listener-status",
    {
      ...data,
      status: clients[data.listener.id] ? "online" : "offline",
    },
  );

  if (clients[data.listener.id]) {
    // Step03: if listener online, send request to listener peerId
    emitNotifyToArray(
      clients,
      data.listener.id,
      io,
      "server-listener-request-peer-id",
      data,
    );
  }
};
module.exports = checkListenerStatus;
