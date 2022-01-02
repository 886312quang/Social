const { validationResult } = require("express-validator/check");
const UserModel = require("../models/userModel");
const GroupModel = require("../models/chatGroupsModel");
const { transSuccess, transErrors } = require("../../lang/vi");
const { user } = require("../services/index");
const multer = require("multer");
const fsExtra = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const app = require("../config/app");
const group = require("./group");
const request = require("request");

let load = async (req, res, next, id) => {
  try {
    const user = await UserModel.get(id);
    console.log(user);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

let getCurrentUser = async (req, res) => {
  const user = await UserModel.getNormalUserDataById(req.user._id);

  return res.status(200).json(user);
};

let updatePassword = async (req, res) => {
  let errorArr = [];
  let validationErr = validationResult(req);
  if (!validationErr.isEmpty()) {
    let errors = Object.values(validationErr.mapped());
    errors.forEach((item) => {
      errorArr.push(item.msg);
    });
    return res.status(500).json({ message: errorArr });
  }

  try {
    let updateUserItem = req.body;
    await user.updatePassword(req.user._id, updateUserItem);

    let result = {
      message: transSuccess.updatedPassword,
    };
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let updateInfo = async (req, res) => {
  let errorArr = [];
  let validationErr = validationResult(req);
  if (!validationErr.isEmpty()) {
    let errors = Object.values(validationErr.mapped());
    errors.forEach((item) => {
      errorArr.push(item.msg);
    });
    return res.status(500).send({ message: errorArr });
  }
  try {
    let updateUserItem = req.body;
    await user.updateUser(req.user._id, updateUserItem);

    await GroupModel.updateUserInfo(req.user._id, updateUserItem);

    let result = {
      message: transSuccess.updatedUserInfo,
    };
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
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
    if (error) {
      console.log(error);
      if (error.message) {
        return res.status(500).send(transErrors.avatar_size_errors);
      }
      return res.status(500).send(error);
    }
    try {
      let updateUserItem = {
        avatar: req.file.filename,
        updatedAt: Date.now(),
      };

      let userUpdate = await user.updateUser(req.user._id, updateUserItem);

      // Remove old user
      if (userUpdate.avatar !== "avatar-default.jpg") {
        await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);
      }

      await GroupModel.updateUserAvatar(req.user._id, req.file.filename);

      let result = {
        message: transSuccess.updatedUserInfo,
        imageSrc: `/${req.file.filename}`,
      };

      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

let getICETurnServer = () => {
  return new Promise(async (resolve, reject) => {
    // Node Get ICE STUN and TURN list
    let o = {
      format: "urls",
    };

    let bodyString = JSON.stringify(o);

    let options = {
      url: "https://global.xirsys.net/_turn/ahoo-chat",
      method: "PUT",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            "dasdaha123456:ab1cfb58-c7f8-11ea-95a2-0242ac150003",
          ).toString("base64"),
        "Content-Type": "application/json",
        "Content-Length": bodyString.length,
      },
    };

    // Call a request to get ICE of turn server
    request(options, (error, response, body) => {
      if (error) {
        console.log("Error when get ICE");
        return reject(error);
      }
      // body la 1 string gui ve client la Json nen chuyen qua Json
      let bodyJson = JSON.parse(body);
      resolve(bodyJson.v.iceServers);
    });
    //resolve([]);
  });
};

let iceServersList = async (req, res) => {
  try {
    const listIce = await getICETurnServer();
    return res.status(200).json(listIce);
  } catch (error) {
    console.log(error);
  }
};

let follow = async (req, res) => {
  try {
    if (req.user._id !== req.params.id) {
      const user = await UserModel.findById(req.params.id);
      const currentUser = await UserModel.findById(req.user._id);

      if (!user.followers.includes(req.user._id)) {
        await user.updateOne({ $push: { followers: req.user._id } });
        await currentUser.updateOne({ $push: { followings: req.user._id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You allready follow this user");
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

let unfollow = async (req, res) => {
  try {
    if (req.user._id !== req.params.id) {
      const user = await UserModel.findById(req.params.id);
      const currentUser = await UserModel.findById(req.user._id);

      if (user.followers.includes(req.user._id)) {
        await user.updateOne({ $pull: { followers: req.user._id } });
        await currentUser.updateOne({ $pull: { followings: req.user._id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You allready unfollow this user");
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = {
  getCurrentUser,
  load,
  updatePassword,
  updateInfo,
  updateAvatar,
  iceServersList,
  follow,
  unfollow,
};
