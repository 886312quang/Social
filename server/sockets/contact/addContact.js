const { emitNotifyToArray } = require("../../helpers/socketHelper");

let addContact = (io, data, clients, user) => {
  /* id: id notify
      _id: id user
  */
  let notify = {
    content: `đã gửi lời mời kết bạn với bạn.`,
    avatar: user.avatar,
    userName: user.userName,
    id: data.notify._id,
    _id: data.newContact.userId,
    isRead: false,
    createdAt: data.notify.createdAt,
    type: "add_contact",
    link: `friend-profile/${data.newContact.userId}`,
  };
  // emit Data
  if (clients[data.newContact.contactId]) {
    emitNotifyToArray(
      clients,
      data.newContact.contactId,
      io,
      "response-add-contact",
      notify
    );
  }
};

module.exports = addContact;
