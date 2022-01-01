const { emitNotifyToArray } = require("../../helpers/socketHelper");

let typingOff = (io, data, clients, user) => {
  if (data.receiverId) {
    if (clients[data.receiverId]) {
      emitNotifyToArray(
        clients,
        data.receiverId,
        io,
        "response-typing-off",
        data,
      );
    }
  }
};

module.exports = typingOff;
