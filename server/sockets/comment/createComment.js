const { emitNotifyToArray } = require("../../helpers/socketHelper");
const { contact } = require("../../services");

let createComment = async (io, data, clients, user) => {
  /* id: id notify
      _id: id user
  */
  const newComment = await data?.newPost?.comments[data?.newPost?.comments?.length - 1];
  const contacts = await contact.getContacts(newComment?.postUserId);

  let notify = {
    content: `${
      newComment.reply
        ? "đã nhắc đến bạn trong một bình luận."
        : "đã bình luận vào bài đăng của bạn."
    }`,
    avatar: user.avatar,
    userName: user.userName,
    _id: data?.notify?._id,
    id: data?.notify?._id,
    isRead: false,
    createdAt: data?.notify?.createdAt,
    type: "comment_post",
    link: data?.notify?.link,
  };

  let res = {
    notify,
    data: data.newPost,
  };

  if (clients[newComment?.tag?._id] && newComment?.tag?._id != user._id) {
    emitNotifyToArray(
      clients,
      newComment?.tag?._id,
      io,
      "response-create-comment",
      res
    );
  }

  if (clients[newComment?.user?._id] && newComment?.postUserId != user._id && !newComment.reply ) {
    emitNotifyToArray(
      clients,
      newComment?.postUserId,
      io,
      "response-create-comment",
      res
    );
  }

  contacts?.map((item) => {
    console.log("item", item)
    if (clients[item._id] && item._id != user._id)
      emitNotifyToArray(clients, item._id, io, "response-create-comment", {
        data: res.data,
      });
  });
};

module.exports = createComment;
