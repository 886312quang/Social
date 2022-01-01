const { group } = require("../services/index");
const { validationResult } = require("express-validator/check");
const GroupModel = require("./../models/chatGroupsModel");
const UserModel = require("./../models/userModel");
const multer = require("multer");
const app = require("../config/app");
const fsExtra = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const { transSuccess, transErrors } = require("../../lang/vi");

let addNew = async (req, res) => {
  let errorArr = [];
  let validationErr = validationResult(req);
  if (!validationErr.isEmpty()) {
    let errors = Object.values(validationErr.mapped());
    errors.forEach((item) => {
      errorArr.push(item.msg);
    });
    console.log(errorArr);
    return res.status(500).send(errorArr);
  }
  try {
    let membersTemp = req.body.members;
    let captionId = req.user._id;
    membersTemp.push({ userId: captionId });
    let name = req.body.name;
    let members = membersTemp.map(
      async (member) => await UserModel.getNormalUserDataById(member.userId),
    );

    members = await Promise.all(members);

    let newGroup = await group.addNew(captionId, members, name);

    return res.status(200).send(newGroup); // return true or false with !!newContact
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeMember = async (req, res, next) => {
  try {
    let groupId = req.query.group;
    let userId = req.query.user;
    let currentUser = req.user;

    const group = await GroupModel.getChatGroupById(groupId);

    if (!group) {
      return res.status(500).send({ message: "ChatGroup does not exist" });
    }

    // Admin
    if (group.userId === currentUser._id || currentUser._id === userId) {
      group.members.remove(userId);
      await group.save();
      return res.status(200).send({ message: "success" });
    }

    return res.status(500).send({ message: "Not Admin" });
  } catch (error) {
    next(error);
  }
};

let addMember = async (req, res, next) => {
  try {
    let { member, chatGroupId } = req.body;
    let currentUser = req.user;
    const group = await GroupModel.getChatGroupById(chatGroupId);
    let check = false;

    let members = member.map(
      async (i) => await UserModel.getNormalUserDataById(i),
    );

    members = await Promise.all(members);

    if (!group) {
      return res.status(500).send({ message: "ChatGroup does not exist" });
    }

    group.members.forEach((m) => {
      if (m._id === currentUser._id) check = true;
    });

    if (check) {
      await GroupModel.findOneAndUpdate(
        { _id: chatGroupId },
        {
          $addToSet: { members },
        },
      );
      return res.status(200).send({ message: "success" });
    }

    return res.status(500).send({ message: "Not member" });
  } catch (error) {
    next(error);
  }
};

// Update Avatar
let storageAvatar = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.avatar_directory);
  },
  filename: (req, file, callback) => {
    let math = app.avatar_type;
    if (math.indexOf(file.mimetype) === -1) {
      return callback(transErrors.avatar_type_errors);
    }
    let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    callback(null, avatarName);
  },
});

let avatarUploadFile = multer({
  storage: storageAvatar,
  limits: { fileSize: app.avatar_limit_size },
}).single("avatar");

let updateAvatar = (req, res) => {
  avatarUploadFile(req, res, async (error) => {
    if (!req.file) {
      return res.status(500).send(error);
    }
    if (error) {
      console.log(error);
      if (error.message) {
        return res.status(500).send(transErrors.avatar_size_errors);
      }
      return res.status(500).send(error);
    }
    try {
      let chatGroupUpdate = await GroupModel.findOneAndUpdate(
        { _id: req.params.chatGroupId },
        { avatar: req.file.filename },
      );

      // Remove old
      if (chatGroupUpdate.avatar !== "avatar-group.jpg") {
        await fsExtra.remove(
          `${app.avatar_directory}/${chatGroupUpdate.avatar}`,
        );
      }

      let result = {
        message: transSuccess.updatedUserInfo,
        imageSrc: `${req.file.filename}`,
      };

      return res.send(result);
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

let updateInfo = async (req, res) => {
  try {
    await GroupModel.findOneAndUpdate(
      { _id: req.body.id },
      { name: req.body.name },
    );

    return res.status(200).send({ message: transSuccess.updatedUserInfo });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  addNew: addNew,
  addMember,
  removeMember,
  updateAvatar,
  updateInfo,
};
