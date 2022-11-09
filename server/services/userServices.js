const UserModel = require("./../models/userModel");
const { transErrors } = require("./../../lang/vi");
const bcrypt = require("bcrypt");

const saltRounds = 7;

/**
 * Update user Info
 * @param {userId} id
 * @param {data Update} item
 */

let updateUser = (id, item) => {
  console.log(item);
  return UserModel.updateUser(id, item);
};

/**
 * Update user Info
 * @param {userId} id
 * @param {data Update} dataUpdate
 */
let updatePassword = (id, dataUpdate) => {
  return new Promise(async (resolve, reject) => {
    let currentUser = await UserModel.findUserByIdToUpdatePassword(id);
    if (!currentUser) {
      return reject(transErrors.account_undefine);
    }
    let checkCurrentPassword = await currentUser.comparePassword(
      dataUpdate.currentPassword,
    );

    let checkNewPassword = await currentUser.comparePassword(
      dataUpdate.newPassword,
    );
    if (!checkCurrentPassword) {
      return reject(transErrors.user_current_password_failed);
    }
    if (checkNewPassword) {
      return reject(transErrors.user_new_password_failed);
    }

    let salt = bcrypt.genSaltSync(saltRounds);

    await UserModel.updatePassword(
      id,
      bcrypt.hashSync(dataUpdate.confirm, salt),
    );

    resolve(true);
  });
};

module.exports = {
  updateUser: updateUser,
  updatePassword: updatePassword,
};
