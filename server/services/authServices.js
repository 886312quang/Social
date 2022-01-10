const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { transErrors, transSuccess, transMail } = require("./../../lang/vi");
const PasswordResetToken = require("../models/passwordResetModel");
const emailProvider = require("../services/emails/emailProvider");

let saltRounds = 7;

let register = (fullname, email, gender, password, protocol, host) => {
  return new Promise(async (resolve, reject) => {
    let userByEmail = await UserModel.findByEmail(email);
    if (userByEmail) {
      if (userByEmail.deletedAt != null) {
        return reject({ message: transErrors.account_removed });
      }
      if (!userByEmail.local.isActive) {
        return reject({ message: transErrors.account_notActive });
      }
      return reject({ message: transErrors.account_in_use });
    }
    let salt = bcrypt.genSaltSync(saltRounds);
    let userItem = {
      userName: fullname,
      gender: gender,
      local: {
        email: email,
        password: bcrypt.hashSync(password, salt),
        verifyToken: uuidv4(),
      },
    };
    let user = await UserModel.createNew(userItem);

    if (!user) {
      reject(transMail.send_failed);
    }

    //const verifyEmailAccount = await PasswordResetToken.generate(user);

    emailProvider.verifyEmailAccount(user);

    resolve(transSuccess.userCreated(user.local.email), user);

    /* let linkVerify = `${protocol}://${host}/api/auth/verify/${user.local.verifyToken}`;
    // Send mail
    sendMail(email, transMail.subject, transMail.template(linkVerify))
      .then((success) => {
        resolve(transSuccess.userCreated(user.local.email), user);
      })
      .catch(async (error) => {
        await UserModel.removeById(user._id);
        reject(transMail.send_failed);
      }); */
  });
};

let verifyAccount = (token) => {
  return new Promise(async (resolve, reject) => {
    let userByToken = await UserModel.findByToken(token);
   
    if (!userByToken) {
      return reject(transErrors.undefine_token);
    }
    await UserModel.verify(token);
    resolve(transSuccess.accountActive);
  });
};

module.exports = {
  register,
  verifyAccount,
};
