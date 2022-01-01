const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
  name: String,
  userAmount: { type: Number, min: 3, max: 999 },
  messageAmount: { type: Number, default: 0 },
  userId: String,
  avatar: { type: String, default: "avatar-group.jpg" },
  members: [
    {
      _id: String,
      phone: String,
      address: String,
      avatar: String,
      userName: String,
    },
  ],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  deletedAt: { type: Number, default: null },
  messages: [],
  conversationType: { type: String, default: "ChatGroup" },
});

ChatGroupSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  /**
   * get chat group by userID and limit
   * @param {string} userId
   * @param {number} limit
   */
  getChatGroups(userId, limit) {
    //$elemMatch truy van mang trong mongoesDB
    return this.find({ members: { $elemMatch: { _id: userId } } })
      .sort({ updatedAt: -1 }) // sap xeo tu cao xuong thap cao la thang thoi gian gan nhat
      .limit(limit)
      .exec();
  },
  getChatGroupsByMember(userId) {
    //$elemMatch truy van mang trong mongoesDB
    return this.find({ members: { $elemMatch: { _id: userId } } }).exec();
  },
  updateUserAvatar(userId, avatar) {
    //$elemMatch truy van mang trong mongoesDB
    return this.updateMany(
      {
        members: { $elemMatch: { _id: userId } },
      },
      { $set: { "members.$[element].avatar": avatar } },
      { arrayFilters: [{ "element._id": userId }] },
    ).exec();
  },
  updateUserInfo(userId, info) {
    //$elemMatch truy van mang trong mongoesDB
    return this.updateMany(
      {
        members: { $elemMatch: { _id: userId } },
      },
      {
        $set: { "members.$[element].userName": info.userName },
      },
      { arrayFilters: [{ "element._id": userId }] },
    ).exec();
  },
  updateUserAvatar(userId, avatar) {
    //$elemMatch truy van mang trong mongoesDB
    return this.updateMany(
      {
        members: { $elemMatch: { _id: userId } },
      },
      {
        $set: { "members.$[element].avatar": avatar },
      },
      { arrayFilters: [{ "element._id": userId }] },
    ).exec();
  },
  getChatGroupById(id) {
    //$elemMatch truy van mang trong mongoesDB
    return this.findById(id).exec();
  },
  /**
   * Update groups chat when have new message
   * @param {string} id
   * @param {number} newMessageAmount
   */
  updateWhenAddNewMessage(id, newMessageAmount) {
    return this.findByIdAndUpdate(id, {
      messageAmount: newMessageAmount,
      updatedAt: Date.now(),
    }).exec();
  },

  getChatGroupIdsByUser(userId) {
    return this.find(
      { members: { $elemMatch: { _id: userId } } },
      { _id: 1 },
    ).exec();
  },
  readMoreChatGroup(userId, skip, limit) {
    //$elemMatch truy van mang trong mongoesDB
    return this.find({ members: { $elemMatch: { _id: userId } } })
      .sort({ updatedAt: -1 }) // sap xeo tu cao xuong thap cao la thang thoi gian gan nhat
      .skip(skip)
      .limit(limit)
      .exec();
  },
};

module.exports = mongoose.model("chat-group", ChatGroupSchema);
