const { emitNotifyToArray } = require("../../helpers/socketHelper");

let changeNameGroup = async (io, data, clients, user) => {
  let response = {
    id: data.id,
    name: data.name,
  };

  data.members.forEach((member) => {
    if (clients[member._id] && member._id != user._id) {
      emitNotifyToArray(
        clients,
        member._id,
        io,
        "response-change-name-group",
        response,
      );
    }
  });
};

module.exports = changeNameGroup;
