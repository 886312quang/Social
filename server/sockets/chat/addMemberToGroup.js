const { emitNotifyToArray } = require("../../helpers/socketHelper");

let addMemberToGroup = async (io, data, clients, user) => {
  let response = {
    member: data.member,
    chatGroupId: data.chatGroupId,
  };

  data.messages.members.forEach((member) => {
    if (clients[member._id] && member._id != user._id) {
      emitNotifyToArray(
        clients,
        member._id,
        io,
        "response-add-member-to-group",
        response,
      );
    }
  });
  let messages = data.messages;

  let members = messages.members.concat(data.member);

  messages.members = members;

  data.member.forEach((m) => {
    if (clients[m._id]) {
      emitNotifyToArray(
        clients,
        m._id,
        io,
        "response-added-to-group",
        messages,
      );
    }
  });
};

module.exports = addMemberToGroup;
