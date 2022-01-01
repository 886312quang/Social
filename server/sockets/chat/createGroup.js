const { emitNotifyToArray } = require("../../helpers/socketHelper");

let createGroup = (io, data, clients, user) => {
  let response = {
    data,
  };

  data.members.forEach((member) => {
    if (clients[member._id] && member._id != user._id) {
      emitNotifyToArray(
        clients,
        member._id,
        io,
        "response-new-group-created",
        response,
      );
    }
  });
};

module.exports = createGroup;
