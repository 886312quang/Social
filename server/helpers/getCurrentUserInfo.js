const UserModel = require("../models/userModel");

const getCurrentUserInfo = async (id) => {
  try {
    const user = await UserModel.getNormalUserDataById(id);

    if (user) return user;
    return null;
  } catch (error) {
    throw error;
  }
};

module.exports = getCurrentUserInfo;
