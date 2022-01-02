const mongoose = require("mongoose");
const { findByIdAndRemove } = require("./userModel");

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  /**
   * Find all items that related with user.
   * @param {*} userId
   */
  findAllByUser(userId) {
    return this.find({
      $or: [{ userId: userId }, { contactId: userId }],
    }).exec();
  },

  /**
   * Check exist of 2 user
   * @param {string} userId
   * @param {string} contactId
   */
  checkContactExists(userId, contactId) {
    return this.findOne({
      $or: [
        { $and: [{ userId: userId }, { contactId: contactId }] },
        { $and: [{ userId: contactId }, { contactId: userId }] },
      ],
    }).exec();
  },
  /**
   * Remove Contact
   * @param {String} userId
   * @param {String} contactId
   */
  removeContact(userId, contactId) {
    return this.deleteOne({
      $or: [
        {
          $and: [
            { userId: userId },
            { contactId: contactId },
            { status: true },
          ],
        },
        {
          $and: [
            { userId: contactId },
            { contactId: userId },
            { status: true },
          ],
        },
      ],
    }).exec();
  },
  /**
   * Remove request Contact sent
   * @param {string} userId
   * @param {string} contactId
   */
  removeRequestContactSent(userId, contactId) {
    return this.deleteOne({
      $and: [{ userId: userId }, { contactId: contactId }, { status: false }],
    }).exec();
  },
  /**
   * Remove request Contact received
   * @param {String} userId
   * @param {String} contactId
   */
  removeRequestContactReceived(userId, contactId) {
    return this.deleteOne({
      $and: [{ contactId: userId }, { userId: contactId }, { status: false }],
    }).exec();
  },

  /**
   * Accept request Contact received
   * @param {String} userId
   * @param {String} contactId
   */
  acceptRequestContactReceived(userId, contactId) {
    return this.update(
      {
        $and: [{ contactId: userId }, { userId: contactId }, { status: false }],
      },
      { status: true, updatedAt: Date.now() },
    ).exec();
  },

  /**
   * Get contacts by userId and limit
   * @param {string} userId
   * @param {number} limit
   */
  getContacts(userId, limit) {
    return this.find({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true },
      ],
    })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * Get contacts by userId and limit
   * @param {string} userId
   */
  getFriend(userId) {
    return this.find({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true },
      ],
    })
      .sort({ updatedAt: -1 })
      .exec();
  },

  getContactsSent(userId, limit) {
    return this.find({
      $and: [{ userId: userId }, { status: false }],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },
  getContactsReceived(userId, limit) {
    return this.find({
      $and: [{ contactId: userId }, { status: false }],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  /**
   * Count all contacts by userId
   * @param {string} userId
   */
  countAllContacts(userId) {
    return this.countDocuments({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true },
      ],
    }).exec();
  },
  countAllContactsSent(userId) {
    return this.countDocuments({
      $and: [{ userId: userId }, { status: false }],
    }).exec();
  },
  countAllContactsReceived(userId) {
    return this.countDocuments({
      $and: [{ contactId: userId }, { status: false }],
    }).exec();
  },
  readMoreContacts(userId, skip, limit) {
    return this.find({
      $and: [
        { $or: [{ userId: userId }, { contactId: userId }] },
        { status: true },
      ],
    })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  readMoreContactsSent(userId, skip, limit) {
    return this.find({
      $and: [{ userId: userId }, { status: false }],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
  readMoreContactsReceived(userId, skip, limit) {
    return this.find({
      $and: [{ contactId: userId }, { status: false }],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },

  /**
   * Update contact (personal) when add new message
   * @param {string} userId currentUserId
   * @param {string} contactId contactId
   */
  updateWhenAddNewMessage(userId, contactId) {
    return this.update(
      {
        $or: [
          { $and: [{ userId: userId }, { contactId: contactId }] },
          { $and: [{ userId: contactId }, { contactId: userId }] },
        ],
      },
      { updatedAt: Date.now() },
    ).exec();
  },
};

module.exports = mongoose.model("contact", ContactSchema);
