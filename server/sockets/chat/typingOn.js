const { emitNotifyToArray } = require("../../helpers/socketHelper");

let typingOn = (io, data, clients, user) => {
  if (data.receiverId) {
    if (clients[data.receiverId]) {
      emitNotifyToArray(
        clients,
        data.receiverId,
        io,
        "response-typing-on",
        data,
      );
    }
  }
};

module.exports = typingOn;
