const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  link: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  deletedAt: { type: Number, default: null },
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  removeRequestContactSentNotification(senderId, receiverd, type) {
    return this.remove({
      $and: [{ senderId: senderId }, { receiverId: receiverd }, { type: type }],
    }).exec();
  },
  /**
   * Get notify by userId and limit nt
   * @param {string} userId
   * @param {number} limit
   */
  getByUserIdAndLimit(userId, limit) {
    return this.find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },
  /**
   * Count all notify Unread
   * @param {string} userId
   */
  countNotifyUnread(userId) {
    return this.count({
      $and: [{ receiverId: userId }, { isRead: false }],
    }).exec();
  },

  /**
   * Read more notification
   * @param {string} userId
   * @param {number} skip
   * @param {number} limit
   */
  readMore(userId, skip, limit) {
    //.skip bo qua nhung thang skip dau tiep tuc lay limit
    return this.find({ receiverId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  /**
   *
   * @param {string} userId
   * @param {Array} targetUsers
   */
  markAllAsRead(userId, targetUsers) {
    return this.updateMany(
      {
        //$in gia tri co nam trong mang || nin not in nhung thang k nam trong mang
        $and: [{ receiverId: userId }, { senderId: { $in: targetUsers } }],
      },
      { isRead: true }
    )
      .limit(10)
      .exec();
  },

  /**
   *
   * @param {string} id
   */
  markNotify(id) {
    return this.findByIdAndUpdate(id, { isRead: true }).exec();
  },
};

const NOTIFICATION_TYPES = {
  ADD_CONTACT: "add_contact",
  ACCEPT_CONTACT: "accept_contact",
  LIKES_POST: "likes_post",
  COMMENT_POST: "comment_post",
  REP_COMMENT_POST: "rep_comment_post",
};
const NOTIFICATION_CONTENT = {
  getContent: (
    _id,
    notificationType,
    isRead,
    userId,
    userName,
    avatar,
    createdAt,
    link
  ) => {
    if (notificationType === NOTIFICATION_TYPES.ADD_CONTACT) {
      return {
        id: _id,
        userId: userId,
        avatar: avatar,
        userName: userName,
        content: "đã gửi lời mời kết bạn với bạn.",
        createdAt: createdAt,
        isRead: isRead,
        link: `profile/${link}`,
        type: NOTIFICATION_TYPES.ADD_CONTACT,
      };
    }
    if (notificationType === NOTIFICATION_TYPES.ACCEPT_CONTACT) {
      return {
        id: _id,
        userId: userId,
        avatar: avatar,
        userName: userName,
        content: "đã chấp nhận lời mời kết bạn của bạn.",
        createdAt: createdAt,
        isRead: isRead,
        link: `profile/${link}`,
        type: NOTIFICATION_TYPES.ACCEPT_CONTACT,
      };
    }
    if (notificationType === NOTIFICATION_TYPES.LIKES_POST) {
      return {
        id: _id,
        userId: userId,
        avatar: avatar,
        userName: userName,
        content: "đã bày tỏ cảm xúc với bài đăng của bạn.",
        createdAt: createdAt,
        isRead: isRead,
        link: link,
        type: NOTIFICATION_TYPES.LIKES_POST,
      };
    }
    if (notificationType === NOTIFICATION_TYPES.REP_COMMENT_POST) {
      return {
        id: _id,
        userId: userId,
        avatar: avatar,
        userName: userName,
        content: "đã nhắc đến bạn trong một bình luận.",
        createdAt: createdAt,
        isRead: isRead,
        link: link,
        type: NOTIFICATION_TYPES.REP_COMMENT_POST,
      };
    }
    if (notificationType === NOTIFICATION_TYPES.COMMENT_POST) {
      return {
        id: _id,
        userId: userId,
        avatar: avatar,
        userName: userName,
        content: "đã bình luận vào bài đăng của bạn.",
        createdAt: createdAt,
        isRead: isRead,
        link: link,
        type: NOTIFICATION_TYPES.COMMENT_POST,
      };
    }
    return "No matching with any notification type.";
  },
};

module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIFICATION_TYPES,
  contents: NOTIFICATION_CONTENT,
};
