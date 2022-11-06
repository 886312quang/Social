const { emitNotifyToArray } = require("../../helpers/socketHelper");
const { contact } = require("../../services");

let unLikePost = async (io, data, clients, user) => {
  /* id: id notify
      _id: id user
  */

  const contacts = await contact.getContacts(data.user._id);

  /*   let notify = {
    _id: user._id,
  }; */

  // emit Data
  if (clients[data.user._id] && data.user._id != user._id) {
    emitNotifyToArray(clients, data.user._id, io, "response-unlike-post", data);
  }

  contacts?.map((item) => {
    if (clients[item._id] && item._id != user._id)
      emitNotifyToArray(clients, item._id, io, "response-unlike-post", data);
  });
};

module.exports = unLikePost;
