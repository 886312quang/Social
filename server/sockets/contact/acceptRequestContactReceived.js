const { emitNotifyToArray } = require("../../helpers/socketHelper");

let acceptRequestContactReceived = (io, data, clients, user) => {
  /* id: id notify
      _id: id user
  */
  let notify = {
    content: `đã chấp nhận lời mời kết bạn của bạn.`,
    avatar: user.avatar,
    userName: user.userName,
    id: data.id,
    userId: data.userContact._id,
    createdAt: data.userContact.updatedAt,
    type: "accept_contact",
    link: `friend-profile/${data}`,
  };
  // emit Data
  if (clients[data.id]) {
    emitNotifyToArray(
      clients,
      data.id,
      io,
      "response-accept-request-contact-received",
      notify
    );
  }
};

module.exports = acceptRequestContactReceived;
