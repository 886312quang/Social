const { emitNotifyToArray } = require("../../helpers/socketHelper");

let listenerAnswerCall = (io, data, clients, user) => {
  if (clients[data.caller.id]) {
    // Step 13: Server send call success to caller
    emitNotifyToArray(
      clients,
      data.caller.id,
      io,
      "server-caller-answer-call",
      data,
    );
  }
  if (clients[data.listener.id]) {
    // Step 14: Server send call success to listener
    emitNotifyToArray(
      clients,
      data.listener.id,
      io,
      "server-listener-answer-call",
      data,
    );
  }
};
module.exports = listenerAnswerCall;
