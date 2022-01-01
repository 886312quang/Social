const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
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
      { isRead: true },
    )
      .limit(10)
      .exec();
  },
};

const NOTIFICATION_TYPES = {
  ADD_CONTACT: "add_contact",
  ACCEPT_CONTACT: "accept_contact",
  LIKES_POST: "likes_post",
  COMMENT_POST: "comment_post",
};
const NOTIFICATION_CONTENT = {
  getContent: (notificationType, isRead, userId, userName, avatar) => {
    if (notificationType === NOTIFICATION_TYPES.ADD_CONTACT) {
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
    if (notificationType === NOTIFICATION_TYPES.ACCEPT_CONTACT) {
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
    if (notificationType === NOTIFICATION_TYPES.LIKES_POST) {
      if (!isRead) {
        return `
         <div class="notify-read-false" data-uid="${userId}">
          <img
            class="avatar-small"
            src="images/users/${avatar}"
            alt=""
          />
          <strong>${userName}</strong> Đã bày tỏ cảm xúc với bài đăng của bạn.
         </div>`;
      }
      return `
         <div data-uid="${userId}">
          <img
            class="avatar-small"
            src="images/users/${avatar}"
            alt=""
          />
          <strong>${userName}</strong> Đã bày tỏ cảm xúc với bài đăng của bạn.
          </div>`;
    }
    if (notificationType === NOTIFICATION_TYPES.COMMENT_POST) {
      if (!isRead) {
        return `
         <div class="notify-read-false" data-uid="${userId}">
          <img
            class="avatar-small"
            src="images/users/${avatar}"
            alt=""
          />
          <strong>${userName}</strong> Đã bình luận vào bài đăng của bạn.
         </div>`;
      }
      return `
         <div data-uid="${userId}">
          <img
            class="avatar-small"
            src="images/users/${avatar}"
            alt=""
          />
          <strong>${userName}</strong> Đã bình luận vào bài đăng của bạn.
          </div>`;
    }
    return "No matching with any notification type.";
  },
};

module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIFICATION_TYPES,
  contents: NOTIFICATION_CONTENT,
};
