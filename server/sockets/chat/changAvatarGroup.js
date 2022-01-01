const { emitNotifyToArray } = require("../../helpers/socketHelper");

let changeAvatarGroup = async (io, data, clients, user) => {
  let response = {
    id: data.id,
    avatar: data.avatar,
  };

  data.members.forEach((member) => {
    if (clients[member._id] && member._id != user._id) {
      emitNotifyToArray(
        clients,
        member._id,
        io,
        "response-change-avatar-group",
        response,
      );
    }
  });
};

module.exports = changeAvatarGroup;
