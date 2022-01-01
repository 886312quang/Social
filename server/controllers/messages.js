const multer = require("multer");
const app = require("../config/app");
const { transErrors, transSuccess } = require("../../lang/vi");
const { validationResult } = require("express-validator/check");
const { message } = require("../services/index");
const fsExtra = require("fs-extra");
const storagePhoto = require("../utils/storagePhoto");
const storageFile = require("../utils/storageFile");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const fs = require("fs");

let readMoreAllChat = async (req, res) => {
  try {
    // Get Skip number from query params
    let skipPersonal = +req.query.skipPersonal;
    let skipGroup = +req.query.skipGroup;

    // Read More Contact
    let newAllConversation = await message.readMoreAllChat(
      req.user._id,
      skipPersonal,
      skipGroup,
    );
    return res.status(200).json(newAllConversation);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMore = async (req, res) => {
  try {
    //Get skip number from query params
    let skipMessage = +req.query.skip;
    let targetId = req.query.id;
    let chatInGroup = req.query.chatInGroup === "true"; //tips string ->> boolean
    // Read more Contact
    let newMessage = await message.readMore(
      req.user._id,
      skipMessage,
      targetId,
      chatInGroup,
    );

    return res.status(200).send(newMessage);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let creatNewMessage = async (req, res) => {
  let errorArr = [];
  let validationErr = validationResult(req);
  if (!validationErr.isEmpty()) {
    let errors = Object.values(validationErr.mapped());
    errors.forEach((item) => {
      errorArr.push(item.msg);
    });

    return res.status(500).send(errorArr);
  }
  try {
    let sender = {
      id: req.user._id,
      name: req.user.userName,
      avatar: req.user.avatar,
    };

    let receiveId = req.body.receiverId;
    let messageVal = req.body.message;
    let isChatGroup = req.body.isChatGroup;
    let type = req.body.type;

    let newMessage = await message.addNewTextEmoji(
      sender,
      receiveId,
      messageVal,
      isChatGroup,
      type,
    );
    return res.status(200).send({ message: newMessage });
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Sent images
let photosUploadFile = multer(storagePhoto).single("photos");

let addPhotos = (req, res, next) => {
  photosUploadFile(req, res, async (err) => {
    try {
      if (!req.file) {
        console.log(err);
        return res.status(500).send(err);
      }

      let outputFile = req.file.path + ".jpg";

      await sharp(req.file.path).jpeg({ quality: 80 }).toFile(outputFile);

      // delete old file
      /*   await fsExtra.removeSync(req.file.patch); */
      await fs.unlinkSync(req.file.path);
      /* await fsExtra.remove(
        `${app.images_message_directory}/${req.file.filename}.jpg`,
      ); */

      let temp = {
        uid: uuidv4(),
        name: `${req.file.filename}.jpg`,
        path: `/images/message/${req.file.filename}.jpg`,
        status: "done",
        response: { status: "success" },
        linkProps: { download: "image" },
        thumbUrl: `${process.env.REACT_APP_STATIC_URI}/images/message/${req.file.filename}.jpg`,
        pathAdd: `${req.file.path}.jpg`,
      };

      return res.json(temp);
    } catch (error) {
      next(error);
    }
  });
};

let addNewImage = async (req, res) => {
  photosUploadFile(req, res, async (err) => {
    try {
      let sender = {
        id: req.user._id,
        name: req.user.userName,
        avatar: req.user.avatar,
      };

      let receiveId = req.body.receiver;
      let messageVal = [];
      req.body.images.forEach((image) => {
        messageVal.push(image);
      });
      let isChatGroup = req.body.isChatGroup;

      let newMessage = await message.addNewImage(
        sender,
        receiveId,
        messageVal,
        isChatGroup,
      );

      // Remove message value because saved in Mongoose
      newMessage.file.forEach(async (file) => {
        await fsExtra.remove(
          `${app.images_message_directory}/${file.fileName}`,
        );
      });

      return res.status(200).send({ message: newMessage });
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

// Sent files
let attachmentUploadFile = multer(storageFile).single("files");

let addFiles = (req, res, next) => {
  attachmentUploadFile(req, res, async (err) => {
    try {
      if (!req.file) {
        console.log(err);
        return res.status(500).send(err);
      }

      let temp = {
        uid: uuidv4(),
        name: req.file.filename,
        path: `/images/files/${req.file.filename}`,
        status: "done",
        response: { status: "success" },
        linkProps: { download: "file" },
        pathAdd: `${req.file.path}`,
      };

      return res.json(temp);
    } catch (error) {
      next(error);
    }
  });
};

let addNewFiles = async (req, res) => {
  attachmentUploadFile(req, res, async (err) => {
    try {
      let sender = {
        id: req.user._id,
        name: req.user.userName,
        avatar: req.user.avatar,
      };

      let receiveId = req.body.receiver;
      let messageVal = [];

      req.body.files.forEach((file) => {
        messageVal.push(file);
      });

      let isChatGroup = req.body.isChatGroup;

      let newMessage = await message.addNewAttachment(
        sender,
        receiveId,
        messageVal,
        isChatGroup,
      );

      // Remove message value because saved in Mongoose
      newMessage.file.forEach(async (file) => {
        await fsExtra.remove(
          `${app.attachment_message_directory}/${file.fileName}`,
        );
      });

      return res.status(200).send({ message: newMessage });
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

let deleteListImages = async (req, res) => {
  try {
    let data = req.body.fileList;
    let id = req.body.id;
    let directory;

    if (req.body.type === "images") {
      directory = app.images_message_directory;
    } else if (req.body.type === "files") {
      directory = app.attachment_message_directory;
    }

    data.forEach(async (item) => {
      // Remove images
      if (id) {
        if (item.uid === id) {
          await fsExtra.remove(`${directory}/${item.response.name}`);
          return;
        }
      } else {
        await fsExtra.remove(
          `${app.images_message_directory}/${item.response.name}`,
        );
      }
    });
    return res.status(200).send({ message: transSuccess.deleteFileSuccess });
  } catch (error) {
    return res.status(500).send(error);
  }
};

let listImage = async (req, res) => {
  try {
    let receiverId = req.query.id;
    let skip = +req.query.skip;
    let limit = +req.query.limit;
    let userId = req.user._id;
    let type = "" + req.query.type;

    console.log(skip);
    console.log(limit);

    let listImageOrFile = await message.listImageOrFile(
      userId,
      receiverId,
      skip,
      limit,
      type,
    );

    return res.status(200).send(listImageOrFile);
  } catch (error) {
    return res.status(500).send(error);
  }
};
let listFile = async (req, res) => {
  try {
    let receiverId = req.query.id;
    let skip = +req.query.skip;
    let limit = +req.query.limit;
    let userId = req.user._id;
    let type = "" + req.query.type;

    let listImageOrFile = await message.listImageOrFile(
      userId,
      receiverId,
      skip,
      limit,
      type,
    );

    return res.status(200).send(listImageOrFile);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  readMoreAllChat,
  readMore,
  creatNewMessage,
  addPhotos,
  addFiles,
  addNewImage,
  addNewFiles,
  deleteListImages,
  listImage,
  listFile,
};
