const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    name: String,
    avatar: String,
  },
  receiver: {
    id: String,
    name: String,
    avatar: String,
  },
  text: String,
  file: [{ data: Buffer, contentType: String, fileName: String }],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

MessageSchema.statics = {
  /**
   * Create new message
   * @param {object} item
   */
  createNew(item) {
    return this.create(item);
  },

  /**
   * get messages limit items one time personal
   * @param {string} senderId currentUserId
   * @param {string} receiverId id of contact
   * @param {number} limit
   */
  getMessagesInPersonal(senderId, receiverId, limit) {
    return this.find({
      $or: [
        { $and: [{ senderId: senderId }, { receiverId: receiverId }] },
        { $and: [{ receiverId: senderId }, { senderId: receiverId }] },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },
  readMoreMessagesInPersonal(senderId, receiverId, skip, limit) {
    return this.find({
      $or: [
        { $and: [{ senderId: senderId }, { receiverId: receiverId }] },
        { $and: [{ receiverId: senderId }, { senderId: receiverId }] },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  /**
   * Get messages In groups
   * @param {string} receiverId // id of groups chat
   * @param {number} limit
   */
  getMessagesInGroups(receiverId, limit) {
    return this.find({ receiverId: receiverId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },
  readMoreMessagesInGroups(receiverId, skip, limit) {
    return this.find({ receiverId: receiverId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  getListImageOrFile(senderId, receiverId, skip, limit, type) {
    return this.find({
      $and: [
        {
          $or: [
            { $and: [{ senderId: senderId }, { receiverId: receiverId }] },
            { $and: [{ receiverId: senderId }, { senderId: receiverId }] },
            {
              $and: [{ receiverId: receiverId }, { conversationType: "group" }],
            },
          ],
        },
        {
          messageType: type,
        },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
};

const MESSAGE_CONVERSATION_TYPES = {
  PERSONAL: "personal",
  GROUP: "group",
  NOTIFICATION: "notification",
};

const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
};

module.exports = {
  model: mongoose.model("message", MessageSchema),
  conversationType: MESSAGE_CONVERSATION_TYPES,
  messageType: MESSAGE_TYPES,
};
