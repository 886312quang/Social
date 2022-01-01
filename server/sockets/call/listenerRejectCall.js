const { emitNotifyToArray } = require("../../helpers/socketHelper");

let listenerRejectCall = (io, data, clients, user) => {
  // listener hủy cuộc gọi
  if (clients[data.caller.id]) {
    //Step12: server send listener cancel call
    emitNotifyToArray(
      clients,
      data.caller.id,
      io,
      "server-caller-reject-call",
      data,
    );
  }
};
module.exports = listenerRejectCall;
