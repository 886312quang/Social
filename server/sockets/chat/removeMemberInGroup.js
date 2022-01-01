const { emitNotifyToArray } = require("../../helpers/socketHelper");

let removeMemberInGroup = (io, data, clients, user) => {
  let response;
  data.members.forEach((member) => {
    if (clients[member._id] && member._id != user._id) {
      if (member._id === data.id) {
        response = {
          id: data.id,
          chatGroupId: data.chatGroupId,
          deleted: true,
        };
      } else {
        response = {
          id: data.id,
          chatGroupId: data.chatGroupId,
          deleted: false,
        };
      }
      emitNotifyToArray(
        clients,
        member._id,
        io,
        "response-remove-member-in-group",
        response,
      );
    }
  });
};

module.exports = removeMemberInGroup;
