const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let PostSchema = new Schema({
  userId: String,
  title: String,
  content: String,
  hashtag: String,
  images: [{ url: String }],
  summary: String,
  type: { type: String, default: "Personal" },
  likes: [{
    userId: String,
    likeId: { type: Number, default: 0 },
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
    deletedAt: { type: Number, default: null },
  }],
  comments: [{
    userId: String,
    content: String,
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
    deletedAt: { type: Number, default: null },
  }],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  deletedAt: { type: Number, default: null },
});

PostSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  /**
   * Read more Post
   * @param {string} id
   * @param {number} skip
   * @param {number} limit
   */
  getGroupById(id, skip, limit) {
    return this.find({ _id: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  /**
   * Get post by userId and limit nt
   * @param {string} userId
   * @param {number} limit
   */
  getByUserIdAndLimit(userId, limit) {
    return this.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * Read more Post
   * @param {string} userId
   * @param {number} skip
   * @param {number} limit
   */
  readMore(userId, skip, limit) {
    //.skip bo qua nhung thang skip dau tiep tuc lay limit
    return this.find({ userId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
};

const Post_TYPES = {
  ADD_CONTACT: "add_contact",
  ACCEPT_CONTACT: "accept_contact",
};
const Post_CONTENT = {
  getContent: (PostType, isRead, userId, userName, avatar) => {
    if (PostType === Post_TYPES.ADD_CONTACT) {
      if (!isRead) {
        return `
         <div class="notify-read-false" data-uid="${userId}">
          <img
            class="avatar-small"
            src="images/users/${avatar}"
            alt=""
          />
          <strong>${userName}</strong> đã gửi lời mời kết bạn với
          bạn! </div>`;
      }
      return `
         <div data-uid="${userId}">
          <img
            class="avatar-small"
            src="images/users/${avatar}"
            alt=""
          />
          <strong>${userName}</strong> đã gửi lời mời kết bạn với
          bạn! </div>`;
    }
    if (PostType === Post_TYPES.ACCEPT_CONTACT) {
      if (!isRead) {
        return `
         <div class="notify-read-false" data-uid="${userId}">
          <img
            class="avatar-small"
            src="images/users/${avatar}"
            alt=""
          />
          <strong>${userName}</strong> Đã chấp nhận lời mời kết bạn của bạn.
         </div>`;
      }
      return `
         <div data-uid="${userId}">
          <img
            class="avatar-small"
            src="images/users/${avatar}"
            alt=""
          />
          <strong>${userName}</strong> Đã chấp nhận lời mời kết bạn của bạn.
          </div>`;
    }
    return "No matching with any Post type.";
  },
};

module.exports = {
  model: mongoose.model("post", PostSchema),
  types: Post_TYPES,
  contents: Post_CONTENT,
};
