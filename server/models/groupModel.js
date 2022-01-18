const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let GroupSchema = new Schema({
    groupName: String,
    title: String,
    userAmount: { type: Number, min: 0 },
    countMember: { type: Number, default: 0 },
    countVisited: { type: Number, default: 0 },
    summary: String,
    coverPic: { type: String, default: "avatar-group.jpg" },
    profile: String,
    members: [
        {
            _id: String,
            role: { type: String, default: "user" }
        },
    ],
    posts: [{ postId: String, review: { type: Boolean, default: false } }],
    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
    deletedAt: { type: Number, default: null },
});

GroupSchema.statics = {
    createNew(item) {
        return this.create(item);
    },

    /**
     * get chat group by userID and limit
     * @param {string} userId
     * @param {number} limit
     */
    getGroups(userId, limit) {
        //$elemMatch truy van mang trong mongoesDB
        return this.find({ members: { $elemMatch: { _id: userId } } })
            .sort({ updatedAt: -1 }) // sap xeo tu cao xuong thap cao la thang thoi gian gan nhat
            .limit(limit)
            .exec();
    },
    getGroupsByMember(userId) {
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
    getGroupById(id) {
        //$elemMatch truy van mang trong mongoesDB
        return this.findById(id).exec();
    },
    /**
     * Update groups chat when have new message
     * @param {string} id
     * @param {number} newMessageAmount
     */
    updateWhenVisited(id) {
        return this.findByIdAndUpdate(id, {
            //countVisited: countVisited + 1,
            updatedAt: Date.now(),
        }).exec();
    },

    getGroupIdsByUser(userId) {
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

module.exports = mongoose.model("group", GroupSchema);
