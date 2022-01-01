const ChatGroupModel = require("../models/chatGroupsModel");

const getChatGroupIds = async (id) => {
  try {
    const chatGroupsIds = await ChatGroupModel.getChatGroupIdsByUser(id);

    if (chatGroupsIds) return chatGroupsIds;
    return null;
  } catch (error) {
    throw error;
  }
};

module.exports = getChatGroupIds;
