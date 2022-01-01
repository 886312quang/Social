const { emitNotifyToArray } = require("../../helpers/socketHelper");

let sentMessage = (io, data, clients, user) => {
  if (data.message.conversationType === "personal") {
    if (data.message.receiverId) {
      let response = data.message;
      if (clients[data.message.receiverId]) {
        emitNotifyToArray(
          clients,
          data.message.receiverId,
          io,
          "response-sent-message",
          response,
        );
      }
    }
  } else if (
    data.message.conversationType === "group" ||
    data.message.conversationType === "notification"
  ) {
    let response = data.message;
    data.members.forEach((member) => {
      if (clients[member._id] && member._id != user._id) {
        emitNotifyToArray(
          clients,
          member._id,
          io,
          "response-sent-message",
          response,
        );
      }
    });
  }
};

module.exports = sentMessage;
