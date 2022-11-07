const { emitNotifyToArray } = require("../../helpers/socketHelper");
const { contact } = require("../../services");

let likePost = async (io, data, clients, user) => {
  /* id: id notify
      _id: id user
  */
  const contacts = await contact.getContacts(data?.newPost?.user._id);

  console.log(data, "dattttttttttttaaaaaaaaaaaa")

  let notify = {
    content: `đã bày tỏ cảm xúc với bài đăng của bạn.`,
    avatar: user.avatar,
    userName: user.userName,
    _id: data?.notify?._id,
    id: data?.notify?._id,
    isRead: false,
    createdAt: data?.notify?.createdAt,
    type: "likes_post",
    link: data?.notify?.link,
  };

  let res = {
    notify,
    data: data.newPost,
  };

  if (clients[data.newPost.user._id] && data.newPost.user._id != user._id) {
    emitNotifyToArray(
      clients,
      data.newPost.user._id,
      io,
      "response-like-post",
      res
    );
  }

  contacts?.map((item) => {
    if (clients[item._id] && item._id != user._id)
      emitNotifyToArray(clients, item._id, io, "response-like-post", {
        data: res.data,
      });
  });
};

module.exports = likePost;
