const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const httpStatus = require("http-status");
const APIError = require("../utils/APIError");

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  userName: String,
  gender: { type: String, default: "male" },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  avatar: { type: String, default: "avatar-default.jpg" },
  coverPic: { type: String, default: "avatar-default.jpg" },
  role: { type: String, default: "user" },
  local: {
    email: { type: String, trim: true },
    password: String,
    isActive: { type: Boolean, default: false },
    verifyToken: String,
  },
  facebook: {
    uid: String,
    token: String,
    email: { type: String, trim: true },
  },
  google: {
    uid: String,
    token: String,
    email: { type: String, trim: true },
  },
  followers: [{
    userId: String,
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  }],
  followings: [{
    userId: String,
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  }],
  previewer: [{ userId: String }],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  deletedAt: { type: Number, default: null },
});

UserSchema.statics = {
  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   */
  async get(id) {
    try {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec();
      }
      if (user) {
        return user;
      }
      throw new APIError({
        message: "User does not exist",
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },
  createNew(item) {
    return this.create(item);
  },
  findByEmail(email) {
    return this.findOne({ "local.email": email }).exec();
  },
  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },
  findByToken(token) {
    return this.findOne({ "local.verifyToken": token }).exec();
  },
  verify(token) {
    return this.findOneAndUpdate(
      { "local.verifyToken": token },
      { "local.isActive": true, "local.verifyToken": null },
    );
  },
  findUserByIdToUpdatePassword(id) {
    return this.findById(id).exec();
  },
  //{"local.password": 0} khong tra ve thang pass word chu y
  findUserByIdForSessionToUse(id) {
    return this.findById(id, { "local.password": 0 }).exec();
  },
  findByFacebookUid(uid) {
    return this.findOne({ "facebook.uid": uid }).exec();
  },
  findByGoogleUid(uid) {
    return this.findOne({ "google.uid": uid }).exec();
  },
  updateUser(id, item) {
    //return old item after update
    return this.findByIdAndUpdate(id, item).exec();
  },
  updatePassword(id, hashedPassword) {
    //return old item after update
    return this.findByIdAndUpdate(id, {
      "local.password": hashedPassword,
    }).exec();
  },
  findAllForAddContact(deprecatedUserId, keyword) {
    return this.find(
      {
        $and: [
          { _id: { $nin: deprecatedUserId } }, // lNot in nin tim nhung thang khong nam trong danh sach ban be
          { "local.isActive": true },
          {
            $or: [
              { userName: { $regex: new RegExp(keyword, "i") } },
              { "local.email": { $regex: new RegExp(keyword, "i") } },
              { "facebook.email": { $regex: new RegExp(keyword, "i") } },
              { "google.email": { $regex: new RegExp(keyword, "i") } },
            ],
          },
        ],
      },
      { _id: 1, userName: 1, address: 1, avatar: 1 },
    ).exec();
  },
  findAllToAddGroup(friendId, keyword) {
    return this.find(
      {
        $and: [
          { _id: { $in: friendId } }, // tim nhung thang co id nam trong mang FriendID
          { "local.isActive": true },
          {
            $or: [
              { userName: { $regex: new RegExp(keyword, "i") } },
              { "local.email": { $regex: new RegExp(keyword, "i") } },
              { "facebook.email": { $regex: new RegExp(keyword, "i") } },
              { "google.email": { $regex: new RegExp(keyword, "i") } },
            ],
          },
        ],
      },
      { _id: 1, userName: 1, address: 1, avatar: 1 },
    ).exec();
  },
  getNormalUserDataById(id) {
    return this.findById(id, {
      _id: 1,
      userName: 1,
      address: 1,
      avatar: 1,
      phone: 1,
    }).exec();
  },
  async login(data) {
    const { email, password } = data;
    if (!email)
      throw new APIError({
        message: "An email is required to generate a token",
      });

    const user = await this.findOne({ "local.email": email }).exec();

    const err = {
      status: httpStatus.BAD_REQUEST,
      isPublic: true,
    };
    if (password) {
      if (user && (await user.comparePassword(password))) {
        if (!user.local.isActive) {
          err.message = "CKH";
        } else {
          return user;
        }
      }
    } else {
      err.message = "Incorrect email or password";
    }
    console.log(err);
    throw new APIError(err);
  },
};
UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password);
  },
  transform() {
    const transformed = {};
    const fields = ["_id", "userName", "avatar", "createdAt", "email"];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
};
module.exports = mongoose.model("user", UserSchema);
